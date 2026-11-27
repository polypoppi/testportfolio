// Seed content. In step 3 this moves into the CMS (Cloudflare D1) and is edited from /admin.

export const profile = {
  name: 'Muslihuddin Ghazali',
  fullName: 'Muhammad Muslihuddin bin Mohd Ghazali',
  firstName: 'Muslihuddin',
  initials: 'MG',
  title: 'Aviation Quality & Safety',
  role: 'Load Control Officer cum Quality Officer',
  company: 'Kris Business Hub',
  location: 'Selangor, Malaysia',
  since: 2018,
  email: 'muslihuddin.ghazali@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muslihuddinghazali/',
  github: 'https://github.com/polypoppi',
  photo: '/photo.webp' as string, // replaceable from the admin
  intro:
    'I keep flights balanced and operations safe. Eight years across load control, quality assurance and airport operations, plus a habit of turning paper processes into digital ones.',
};

// Floating tiles on the home page. `logo` is an image URL (built-in or uploaded in the admin);
// tiles without a logo show the short code instead.
export const tools = [
  { code: 'AB', name: 'Airbus', logo: '/logos/airbus.svg' },
  { code: 'X', name: 'Excel', logo: '/logos/excel.svg' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '/logos/singaporeairlines.svg' },
  { code: 'PA', name: 'Power Automate', logo: '/logos/powerautomate.svg' },
  { code: '1A', name: 'Amadeus', logo: '' },
  { code: 'BI', name: 'Power BI', logo: '/logos/powerbi.svg' },
  { code: 'MA', name: 'Malaysia Airports', logo: '' },
  { code: 'SP', name: 'SharePoint', logo: '/logos/sharepoint.svg' },
  { code: 'Qk', name: 'Qlik', logo: '/logos/qlik.svg' },
  { code: 'KB', name: 'Kris Business Hub', logo: '' },
  { code: 'SAP', name: 'SAP', logo: '/logos/sap.svg' },
  { code: 'DG', name: 'Dangerous Goods', logo: '' },
];

export const highlights = [
  { value: '8', unit: 'yrs', label: 'in aviation & operations' },
  { value: '22', unit: '', label: 'staff in Load Control' },
  { value: '42', unit: '', label: 'person terminal team coordinated' },
];

export const experience = [
  {
    role: 'Load Control Officer cum Quality Officer',
    company: 'Kris Business Hub',
    place: 'Kuala Lumpur',
    start: 'Jun 2026',
    end: 'Present',
    tag: 'Quality & Load Control',
    points: [
      'Coordinate Safety Management System activities: safety policy, risk management, assurance and promotion, including safety briefings for Load Control Officers and Duty Managers.',
      'Run quality assurance and audit planning, and maintain the Quality Management SharePoint site with working documents, references and flowcharts under version control.',
      'Built a digital incident reporting form with Power Apps and Power Automate, feeding a SharePoint database for structured submissions and central records.',
      'Support centralised load control for Singapore Airlines flights in Amadeus Altea FM, including payload distribution and dangerous goods positioning under DGR.',
      'Prepare manual loadsheets, trim sheets and LIRs under Business Continuity procedures, coordinating last-minute changes with dispatch, ramp and loadmasters.',
    ],
  },
  {
    role: 'Customer Support Officer, Customer Order Desk',
    company: 'Airbus Flight Hour Service',
    place: 'Putrajaya',
    start: 'Oct 2025',
    end: 'May 2026',
    tag: 'Airworthiness & Components',
    points: [
      'Coordinated component orders for international airlines including Cathay Pacific, British Airways and Malaysia Airlines against Customer Specific Requirements.',
      'Validated Authorized Release Certificates and traceability documents against EASA, FAA and CAAS requirements.',
      'Consolidated data in Qlik and Skywise into reports on component turnaround time and global stock pool activity.',
    ],
  },
  {
    role: 'Admin / Operation Officer',
    company: 'Malaysia Airports Holdings Berhad',
    place: 'Sepang',
    start: 'Dec 2024',
    end: 'Oct 2025',
    tag: 'Airport Operations',
    points: [
      'Coordinated daily terminal operations between technical asset maintenance teams and frontline customer support.',
      'Managed resource allocation and attendance for a 42-person terminal operations team.',
      'Monitored operational safety protocols and team compliance.',
    ],
  },
  {
    role: 'Technology and Media Executive',
    company: 'ENOKU',
    place: 'Kuala Lumpur',
    start: 'May 2022',
    end: 'Sep 2023',
    tag: 'Business Development',
    points: [
      'Secured and delivered four corporate initiatives with enterprise clients including PETRONAS and EY.',
      'Served as Scrum Master, aligning cross-functional work and shortening sprint timelines.',
    ],
  },
  {
    role: 'Apprentice',
    company: 'SEED.LAB (PETRONAS & TCS)',
    place: 'Kuala Lumpur',
    start: 'Sep 2021',
    end: 'Mar 2023',
    tag: 'Apprenticeship',
    points: ['Apprenticeship programme supported by PETRONAS and Tata Consultancy Services.'],
  },
  {
    role: 'Customer Service, SLB Department',
    company: 'Employees Provident Fund (EPF)',
    place: 'Segamat',
    start: 'Aug 2018',
    end: 'Aug 2019',
    tag: 'Customer Service',
    points: ['Supported the department’s customer service operations.'],
  },
];

export const skillGroups = [
  {
    name: 'Quality & Safety',
    items: ['Quality Management System (QMS)', 'Safety Management System (SMS)', 'Quality assurance & internal auditing', 'Safety risk management', 'Document control', 'SOP development', 'Incident reporting & safety communication'],
  },
  {
    name: 'Flight Operations',
    items: ['Aircraft load control', 'Weight & balance', 'Dangerous Goods Regulations (DGR)', 'Regulatory & operational compliance', 'Airworthiness documentation'],
  },
  {
    name: 'Systems & Tools',
    items: ['Amadeus Altea FM & CM', 'Power Apps', 'Power Automate', 'SharePoint', 'Power BI', 'Qlik', 'Skywise', 'AMASIS', 'SAP SKIES', 'Salesforce'],
  },
];

export const projects = [
  {
    slug: 'digital-incident-reporting',
    title: 'Digital Incident Reporting',
    org: 'Kris Business Hub',
    year: '2026',
    summary: 'Replaced paper incident reports with a Power Apps form and Power Automate flow, writing every submission into a SharePoint database.',
    stack: ['Power Apps', 'Power Automate', 'SharePoint'],
    body: [
      'I developed an incident reporting form in Power Apps with a Power Automate flow behind it, integrated with a SharePoint database.',
      'The result is a structured digital reporting and record management workflow for the Load Control Department, supporting incident submission and centralised records for SMS activities.',
    ],
  },
  {
    slug: 'quality-management-sharepoint',
    title: 'Quality Management SharePoint',
    org: 'Kris Business Hub',
    year: '2026',
    summary: 'Organised the department’s quality documents, working references and flowcharts into one version-controlled SharePoint site.',
    stack: ['SharePoint', 'Document control'],
    body: [
      'I maintain and organise the Quality Management SharePoint site: working documents, operational references and process flowcharts.',
      'The aim is document accessibility, version control and consistent information management across the department.',
    ],
  },
  {
    slug: 'component-tat-reporting',
    title: 'Component TAT Reporting',
    org: 'Airbus Flight Hour Service',
    year: '2025',
    summary: 'Combined data from Qlik and Skywise into reports on component turnaround time and global stock pool balance.',
    stack: ['Qlik', 'Skywise'],
    body: [
      'I consolidated multi-source operational data using Qlik and Skywise to prepare analytical reports on component turnaround time (TAT) and global stock pool activity, supporting operational visibility and stock pool balance management.',
    ],
  },
];

export const education = [
  { title: 'Bachelor of Industrial Logistics (Hons)', school: 'Universiti Kuala Lumpur MITEC', years: '2014 – 2017' },
  { title: 'Diploma in Integrated Logistics Management', school: 'Kolej Profesional MARA Bandar Penawar', years: '' },
];

export const certifications = [
  'Certified Aircraft Load Control',
  'Certified Dangerous Goods Category 10',
  'Aircraft Weight and Balance (2026)',
  'Amadeus Altea Flight Management',
  'APU Web Development Associates',
];

// Writing: stories split into chapters. The sample below is placeholder text for the layout only.
export const stories = [
  {
    slug: 'sample-story',
    title: 'Sample Story',
    sample: true,
    blurb: 'A placeholder to preview the reading layout. Your real stories will replace this from the admin.',
    tags: ['Placeholder'],
    status: 'Ongoing',
    cover: '',
    chapters: [
      { slug: 'chapter-1', title: 'Chapter One', body: ['This is placeholder text so you can see how a chapter reads on the page.', 'Paragraphs are set in a comfortable serif at a measured line length, with generous spacing for long reading sessions.'] },
      { slug: 'chapter-2', title: 'Chapter Two', body: ['A second placeholder chapter, to show the previous and next navigation between chapters.'] },
    ],
  },
];
