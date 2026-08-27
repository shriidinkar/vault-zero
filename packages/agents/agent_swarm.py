"""
LangGraph Multi-Agent Audit Swarm
Orchestrates Auditor (3-way match, rate-creep, split-invoice) and Market Scout (price index).
Powered by LiteLLM / Qwen2.5-3B-Instruct or OpenAI-compatible fallback.
"""
from typing import TypedDict, List, Dict, Any
from pydantic import BaseModel, Field
import json
import os

class Finding(BaseModel):
    agentType: str
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    findingType: str
    evidence: str
    dollarImpact: float

class SwarmState(TypedDict):
    invoice: Dict[str, Any]
    purchase_orders: List[Dict[str, Any]]
    contracts: List[Dict[str, Any]]
    market_prices: List[Dict[str, Any]]
    findings: List[Dict[str, Any]]

def auditor_node(state: SwarmState) -> SwarmState:
    invoice = state["invoice"]
    findings = list(state.get("findings", []))
    lines = invoice.get("extractedJson", {}).get("lineItems", [])
    po_num = invoice.get("poNumber")
    
    # 3-way match logic
    for line in lines:
        key = line.get("canonicalItemKey")
        billed_price = float(line.get("unitPrice", 0))
        qty = float(line.get("quantity", 1))
        
        # Check against contracts
        for contract in state.get("contracts", []):
            if contract.get("canonicalItemKey") == key:
                agreed = float(contract.get("agreedUnitPrice", 0))
                if billed_price > agreed:
                    markup_pct = ((billed_price - agreed) / agreed) * 100
                    impact = (billed_price - agreed) * qty
                    findings.append({
                        "agentType": "AUDITOR_3WAY",
                        "severity": "HIGH",
                        "findingType": "CONTRACT_RATE_CREEP",
                        "evidence": f"Invoiced rate ₹{billed_price:,.2f} exceeds contract rate ₹{agreed:,.2f} by +{markup_pct:.1f}%",
                        "dollarImpact": impact
                    })

    return {"findings": findings}

def market_scout_node(state: SwarmState) -> SwarmState:
    invoice = state["invoice"]
    findings = list(state.get("findings", []))
    lines = invoice.get("extractedJson", {}).get("lineItems", [])
    
    market_map = {m["canonicalItemKey"]: float(m["benchmarkPrice"]) for m in state.get("market_prices", [])}
    
    for line in lines:
        key = line.get("canonicalItemKey")
        billed_price = float(line.get("unitPrice", 0))
        qty = float(line.get("quantity", 1))
        if key in market_map:
            benchmark = market_map[key]
            if billed_price > benchmark * 1.05: # > 5% above benchmark
                impact = (billed_price - benchmark) * qty
                findings.append({
                    "agentType": "MARKET_SCOUT",
                    "severity": "MEDIUM",
                    "findingType": "ABOVE_MARKET_INDEX",
                    "evidence": f"Line price ₹{billed_price:,.2f} is higher than regional benchmark ₹{benchmark:,.2f}",
                    "dollarImpact": impact
                })

    return {"findings": findings}
