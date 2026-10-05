import { PracticeArea, Testimonial, BlogPost, Attorney, NavLink, FAQItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Practice Areas', href: '/practice' },
  { name: 'Resources', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export const ATTORNEYS: Attorney[] = [
  {
    id: '1',
    name: 'Julian St. John',
    role: 'Executive Chairman & Strategic Counsel',
    expertise: 'High-Stakes M&A & Sovereign Advisory',
    phone: '09065624016',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    name: 'Eleanor Vance',
    role: 'Managing Partner',
    expertise: 'International Arbitration & Corporate Governance',
    phone: '09065624016',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    role: 'Senior Partner',
    expertise: 'Maritime Law & Global Trade Strategy',
    phone: '09065624016',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
  }
];

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: '1',
    title: 'Alternative Dispute Resolution',
    description: 'Expert mediation and arbitration services to resolve complex legal disputes outside the courtroom efficiently.',
    icon: 'Scale',
  },
  {
    id: '2',
    title: 'Banking & Finance',
    description: 'Comprehensive legal support for financial institutions and corporate borrowers on regulatory and transactional matters.',
    icon: 'Landmark',
  },
  {
    id: '3',
    title: 'Corporate & Commercial',
    description: 'Strategic counsel for businesses on governance, compliance, contracts, and commercial transactions.',
    icon: 'Briefcase',
  },
  {
    id: '4',
    title: 'Intellectual Property',
    description: 'Protecting trademarks, copyrights, and patents to secure the intangible assets of your business.',
    icon: 'Shield',
  },
  {
    id: '5',
    title: 'Real Estate & Probate',
    description: 'Navigating property transactions, zoning, and estate management with precision and foresight.',
    icon: 'Users',
  },
  {
    id: '6',
    title: 'Shipping & Maritime',
    description: 'Specialized legal expertise in maritime law, international shipping regulations, and logistics disputes.',
    icon: 'FileText',
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James Harrison',
    role: 'CEO, Global Dynamics',
    content: 'Harrington and Co provided exceptional guidance during our corporate restructuring. Their professional approach and deep legal expertise were instrumental in our success.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '2',
    name: 'Clara Sterling',
    role: 'Director, Sterling Estates',
    content: 'The level of precision and meticulous attention to detail at Harrington and Co is unmatched. They handled our complex real estate portfolio with absolute integrity.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '3',
    name: 'Robert Miller',
    role: 'Managing Director, Oceanic Shipping',
    content: 'A truly reliable firm. They navigated our maritime disputes with intelligence and efficiency. Highly recommended for any complex legal challenges.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: '4',
    name: 'Arthur Kingsleigh',
    role: 'Chairman, Kingsleigh Group',
    content: 'Harrington and Co represents the pinnacle of legal advocacy. Their boardroom presence is commanding, and their strategic foresight has been indispensable to our international operations.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Shift in Nigerian Maritime Regulations 2024',
    excerpt: 'How new amendments are affecting international shipping routes and local logistics providers.',
    date: 'Jan 10, 2025',
    author: 'Principal Partner',
    category: 'Maritime',
    imageUrl: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Intellectual Property Protection for Startups',
    excerpt: 'Why securing your trademarks early is the most critical step for your business scalability.',
    date: 'Feb 15, 2025',
    author: 'IP Specialist',
    category: 'Intellectual Property',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Does the firm handle international arbitration?",
    answer: "Yes. Our Alternative Dispute Resolution team has represented domestic and international clients in high-stakes arbitrations across London, Paris, and Dubai jurisdictions, specialized in complex commercial and maritime treaties."
  },
  {
    question: "What is the typical response time for urgent maritime matters?",
    answer: "We operate an emergency response protocol for shipping and maritime emergencies. Clients have 24/7 access to specialized partners for arrest of vessels, collisions, or salvage inquiries, typically initiating within 60 minutes of contact."
  },
  {
    question: "Do you offer specialized counsel for tech startups in the Fintech sector?",
    answer: "Absolutely. Our 'Digital Sovereignty' practice group focuses on Nigerian Fintech regulations, CBN compliance, data privacy, and intellectual property protection for high-growth African technology ventures."
  },
  {
    question: "How does the firm calculate professional fees?",
    answer: "We utilize a transparent billing model tailored to the engagement. This typically involves hourly rates for advisory, fixed fees for specific transactions (like incorporation or filings), or performance-based retainers for long-term representation."
  },
  {
    question: "How is client confidentiality maintained?",
    answer: "Privacy is paramount. We employ military-grade encryption for all digital correspondence and maintain strict physical security protocols at our offices. All client data is handled in strict accordance with the Nigerian Data Protection Act."
  },
  {
    question: "Do you provide legal services outside of Nigeria?",
    answer: "Through our established network of associate firms across 24+ jurisdictions, including major financial hubs like London and Dubai, we provide synchronized legal auditing and cross-border representation for international entities."
  },
  {
    question: "Can I book a same-day initial consultation?",
    answer: "Availability depends on the priority level of the matter. Urgent commercial or maritime briefs are prioritized, while general inquiries are typically scheduled within 24 to 48 hours."
  },
  {
    question: "What documents do I need to prepare for a first meeting?",
    answer: "For corporate clients, we recommend providing relevant contracts, incorporation documents, and a summary of the dispute or transaction. For private individuals, valid government identification and any prior legal correspondence related to the matter are required."
  }
];
