export interface RfpItem {
  id: string;
  title: string;
  client: string;
  category: 'Eligible RFPs' | 'Proposal Submitted' | 'Shortlisted' | 'Awarding';
  budgetSar: number;
  deadline: string;
  location: string;
  scopeSummary: string;
  matchScore: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  progressPercent: number;
  dueDate: string;
  status: 'On track' | 'Deliverables needed' | 'Hold' | 'Revision needed' | 'Delayed' | 'Pending payment';
  budgetSar: number;
  paidSar: number;
  category: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  projectTitle: string;
  categoryTag: string;
  date: string;
  timeframe: 'today' | 'this_week' | 'upcoming';
  statusBadge: string;
  badgeType: 'blue' | 'green' | 'amber';
  amountSar?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'rfp' | 'payment' | 'project' | 'kyb';
}

export const INITIAL_RFPS: RfpItem[] = [
  // 6 Eligible RFPs
  {
    id: 'rfp-1',
    title: 'Diplomatic Quarter Luxury Villa Renovation',
    client: 'Al-Nakhla Estates',
    category: 'Eligible RFPs',
    budgetSar: 1850000,
    deadline: '18 May, 2026',
    location: 'Riyadh, KSA',
    scopeSummary: 'Full structural revamp, smart energy facade, Italian marble flooring & pool landscaping.',
    matchScore: 98,
  },
  {
    id: 'rfp-2',
    title: 'Red Sea Coastal Commercial Pavilion',
    client: 'Red Sea Global Hospitality',
    category: 'Eligible RFPs',
    budgetSar: 3400000,
    deadline: '24 May, 2026',
    location: 'Jeddah Waterfront',
    scopeSummary: 'Eco-certified hospitality structure with sustainable timber framing & solar glazing.',
    matchScore: 94,
  },
  {
    id: 'rfp-3',
    title: 'Al-Olaya High-Rise Penthouse Fitout',
    client: 'Skyline Capital Holding',
    category: 'Eligible RFPs',
    budgetSar: 890000,
    deadline: '30 May, 2026',
    location: 'Riyadh Center',
    scopeSummary: 'Bespoke joinery, acoustic partition ceilings, smart lighting automation.',
    matchScore: 92,
  },
  {
    id: 'rfp-4',
    title: 'Diriyah Heritage Boutique Hotel Interior',
    client: 'Diriyah Gate Dev Authority',
    category: 'Eligible RFPs',
    budgetSar: 2200000,
    deadline: '05 June, 2026',
    location: 'Diriyah Historical Park',
    scopeSummary: 'Najdi architectural motifs, earth plaster restoration, custom handwoven fabrics.',
    matchScore: 96,
  },
  {
    id: 'rfp-5',
    title: 'King Abdullah Financial District Tech Hub Fitout',
    client: 'FinTech Kingdom Lab',
    category: 'Eligible RFPs',
    budgetSar: 1450000,
    deadline: '12 June, 2026',
    location: 'KAFD, Riyadh',
    scopeSummary: 'Modular collaborative pods, raised access flooring, high-density server room cooling.',
    matchScore: 90,
  },
  {
    id: 'rfp-6',
    title: 'Khobar Waterfront Medical & Wellness Clinic',
    client: 'Al-Mana Healthcare',
    category: 'Eligible RFPs',
    budgetSar: 1100000,
    deadline: '20 June, 2026',
    location: 'Al-Khobar',
    scopeSummary: 'Medical grade vinyl, antimicrobial surfaces, acoustic treatment for consultation rooms.',
    matchScore: 89,
  },

  // 3 Proposal Submitted
  {
    id: 'rfp-7',
    title: 'Al-Malqa Contemporary Compound 12-Unit Build',
    client: 'Retal Urban Development',
    category: 'Proposal Submitted',
    budgetSar: 4200000,
    deadline: '28 April, 2026',
    location: 'North Riyadh',
    scopeSummary: 'Turnkey residential engineering, greywater recycling, subterranean parking.',
    matchScore: 97,
  },
  {
    id: 'rfp-8',
    title: 'Diplomatic Mission Annex & Security Gatehouse',
    client: 'Consular Corp Riyadh',
    category: 'Proposal Submitted',
    budgetSar: 780000,
    deadline: '02 May, 2026',
    location: 'Diplomatic Quarter',
    scopeSummary: 'Reinforced perimeter walls, ballistic glass integration, automated checkpoint gates.',
    matchScore: 95,
  },
  {
    id: 'rfp-9',
    title: 'King Saud University Innovation Lab Wing',
    client: 'Ministry of Education',
    category: 'Proposal Submitted',
    budgetSar: 1950000,
    deadline: '08 May, 2026',
    location: 'Riyadh Campus',
    scopeSummary: 'Robotics testing pens, rapid prototyping workshops, clean-room ventilation.',
    matchScore: 91,
  },

  // 2 Shortlisted
  {
    id: 'rfp-10',
    title: 'Qiddiya Entertainment District VIP Lounge',
    client: 'Qiddiya Investment Co.',
    category: 'Shortlisted',
    budgetSar: 5600000,
    deadline: '20 April, 2026',
    location: 'Tuwaiq Escarpment',
    scopeSummary: 'Cantilevered cliffside viewing deck, kinetic shading canopy, luxury bar.',
    matchScore: 99,
  },
  {
    id: 'rfp-11',
    title: 'Al-Ula Eco-Resort Stargazing Domes',
    client: 'Royal Commission for AlUla',
    category: 'Shortlisted',
    budgetSar: 3100000,
    deadline: '25 April, 2026',
    location: 'AlUla Valley',
    scopeSummary: 'Geodesic climate-controlled desert domes with solar micro-grid integration.',
    matchScore: 96,
  },

  // 4 Awarding
  {
    id: 'rfp-12',
    title: 'City Apartment Makeover (Phase 3 Final Award)',
    client: 'Smart Renovation Holdings',
    category: 'Awarding',
    budgetSar: 450000,
    deadline: 'Completed',
    location: 'Riyadh Center',
    scopeSummary: 'Contract signed. Final mobilization underway.',
    matchScore: 100,
  },
  {
    id: 'rfp-13',
    title: 'Living Space Transformation Project',
    client: 'Al-Rashid Properties',
    category: 'Awarding',
    budgetSar: 720000,
    deadline: 'Contract Signed',
    location: 'Jeddah North',
    scopeSummary: 'Execution phase initiated. 89% structural phase completed.',
    matchScore: 100,
  },
  {
    id: 'rfp-14',
    title: 'Architectural Interior Revamp Pavilion',
    client: 'Dhahran Design Syndicate',
    category: 'Awarding',
    budgetSar: 580000,
    deadline: 'Contract Signed',
    location: 'Dhahran',
    scopeSummary: 'Engineering approval stamped. Milestone tranche 2 active.',
    matchScore: 100,
  },
  {
    id: 'rfp-15',
    title: 'The Boulevard Riyadh Flagship Store Fitout',
    client: 'Luxe Retail MENA',
    category: 'Awarding',
    budgetSar: 950000,
    deadline: 'Award Pending Sign-off',
    location: 'Riyadh Boulevard',
    scopeSummary: 'Commercial award letter issued. Final bank guarantee submission.',
    matchScore: 99,
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'City Apartment Makeover',
    client: 'Smart Renovation',
    progressPercent: 45,
    dueDate: '23 September, 2026',
    status: 'On track',
    budgetSar: 450000,
    paidSar: 202500,
    category: 'Residential Luxury',
  },
  {
    id: 'proj-2',
    name: 'Living Space Transformation',
    client: 'Al-Rashid Properties',
    progressPercent: 89,
    dueDate: 'November, 2026',
    status: 'Deliverables needed',
    budgetSar: 720000,
    paidSar: 640800,
    category: 'Interior Fitout',
  },
  {
    id: 'proj-3',
    name: 'Architectural Interior Revamp',
    client: 'Dhahran Design Syndicate',
    progressPercent: 46,
    dueDate: 'Quarter 3, 2026',
    status: 'Pending payment',
    budgetSar: 580000,
    paidSar: 266800,
    category: 'Commercial Pavilion',
  },
  {
    id: 'proj-4',
    name: 'Al-Olaya Boutique Penthouse',
    client: 'Skyline Capital',
    progressPercent: 62,
    dueDate: '14 December, 2026',
    status: 'On track',
    budgetSar: 890000,
    paidSar: 551800,
    category: 'High-Rise Residential',
  },
  {
    id: 'proj-5',
    name: 'Red Sea Coastal Cafe Structure',
    client: 'Red Sea Global',
    progressPercent: 28,
    dueDate: '10 January, 2027',
    status: 'Hold',
    budgetSar: 1200000,
    paidSar: 336000,
    category: 'Hospitality',
  },
  {
    id: 'proj-6',
    name: 'Diriyah Gate Cultural Booths',
    client: 'DGDA Authority',
    progressPercent: 75,
    dueDate: '04 October, 2026',
    status: 'Revision needed',
    budgetSar: 650000,
    paidSar: 487500,
    category: 'Heritage Restoration',
  },
];

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms-1',
    title: 'Interior finishing completed',
    projectTitle: 'City Apartment Makeover • Smart Renovation',
    categoryTag: 'Interior',
    date: '2026-04-15',
    timeframe: 'today',
    statusBadge: 'Milestone today',
    badgeType: 'blue',
    amountSar: 35000,
  },
  {
    id: 'ms-2',
    title: 'Milestone payment due',
    projectTitle: 'Living Space Transformation • Smart Renovation',
    categoryTag: 'Finance',
    date: '2026-04-17',
    timeframe: 'this_week',
    statusBadge: 'Payment in 2 days',
    badgeType: 'green',
    amountSar: 48000,
  },
  {
    id: 'ms-3',
    title: 'HVAC Ductwork & Acoustic Testing Sign-off',
    projectTitle: 'Architectural Interior Revamp • Milestone 3',
    categoryTag: 'Engineering',
    date: '2026-04-19',
    timeframe: 'this_week',
    statusBadge: 'Review scheduled',
    badgeType: 'amber',
    amountSar: 22000,
  },
  {
    id: 'ms-4',
    title: 'Final Paint Coating & Snag Inspection',
    projectTitle: 'City Apartment Makeover • Stage 4',
    categoryTag: 'Quality Audit',
    date: '2026-04-24',
    timeframe: 'upcoming',
    statusBadge: 'Upcoming',
    badgeType: 'blue',
    amountSar: 18000,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Your proposal for "Qiddiya VIP Lounge" was shortlisted!',
    time: '12m ago',
    read: false,
    type: 'rfp',
  },
  {
    id: 'notif-2',
    title: 'Payment of SAR 48,000 scheduled for release on April 17.',
    time: '2h ago',
    read: false,
    type: 'payment',
  },
  {
    id: 'notif-3',
    title: 'KYB Verification documentation reminder: Tax ID audit pending.',
    time: '1d ago',
    read: true,
    type: 'kyb',
  },
  {
    id: 'notif-4',
    title: 'Deliverable inspection completed for City Apartment Makeover.',
    time: '2d ago',
    read: true,
    type: 'project',
  },
];
