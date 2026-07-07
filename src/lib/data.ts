// Mock database for Assignment In Need templates

export interface Review {
  name: string;
  institution: string;
  rating: number;
  quote: string;
  avatar?: string;
}

export interface Writer {
  id: string;
  name: string;
  role: string;
  avatar: string; // initials or mock image url
  rating: number;
  reviewCount: number;
  ordersCompleted: number;
  ordersInProgress: number;
  location: string;
  successRate: number;
  expertise: string[];
  qualifications: string;
  experience: string;
  skills: string[];
  helpsWith: string[];
  about: string[];
  credentials: { label: string; value: string }[];
  reviews: Review[];
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  price: number;
  orderCount: string;
  image: string;
}

export interface Subject {
  slug: string;
  name: string;
  iconName: string;
  orderCount: string;
  sampleCount: number;
  letterBadge: string;
  letterColorClass: string;
  assignmentsDelivered: string;
  expertsCount: string;
  rating: string;
  onTimeDelivery: string;
  roleName: string;
  professionalsWord: string;
  standardsWord: string;
  analyticalWord: string;
}

export interface Testimonial {
  name: string;
  institution: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Sample {
  title: string;
  subject: string;
  image: string;
  href: string;
}

export const WRITERS: Writer[] = [
  {
    id: "sophia-adams",
    name: "Dr. Sophia Adams",
    role: "Marketing Expert",
    avatar: "SA",
    rating: 4.9,
    reviewCount: 25,
    ordersCompleted: 680,
    ordersInProgress: 76,
    location: "UK Based",
    successRate: 98,
    expertise: ["Digital Marketing", "Consumer Behavior", "Brand Management", "Market Research", "Marketing Strategy", "Marketing Analytics"],
    qualifications: "Ph.D. in Marketing",
    experience: "7+ Years",
    skills: ["Digital Marketing", "Consumer Behavior", "Brand Management", "Market Research", "Marketing Strategy", "Marketing Analytics"],
    helpsWith: ["Assignment", "Dissertation", "Homework", "Essay", "University", "Thesis", "Case Study"],
    about: [
      "Sophia Adams here! With a Bachelor's from Stanford and a Master's and Ph.D. from Harvard in Marketing, I'm your dedicated academic mentor. I help students grasp market dynamics, develop impactful strategies, and craft persuasive marketing plans. I bridge theory with real-world application, ensuring your assignments shine and set you up for success.",
      "I've worked with students from renowned universities like the University of California, Berkeley, London Business School, the University of Melbourne, and the National University of Singapore, where I've provided specialized marketing assignment assistance at both undergraduate and graduate levels.",
      "My Unique Selling Proposition (USP) lies in my approach to making marketing both insightful and applicable. I focus on practical learning, integrating case studies and industry trends into assignments. This helps students see the real-world relevance of what they study and prepares them for the challenges they will face in their careers."
    ],
    credentials: [
      { label: "Degree", value: "Master's & Ph.D. in Marketing, Harvard University" },
      { label: "Experience", value: "7+ Years Academic Writing & Tutoring" },
      { label: "Expertise", value: "Marketing & Strategy Specialist" },
      { label: "Education", value: "Bachelor's in Marketing, Stanford University" }
    ],
    reviews: [
      { name: "James W.", institution: "University of Manchester", rating: 5, quote: "Dr. Sophia's work on my marketing strategy essay was outstanding. She understands the concepts deeply and delivers beyond expectations!", avatar: "JW" },
      { name: "Olivia R.", institution: "University of Sydney", rating: 5, quote: "Excellent writer! The assignment was perfect, well-researched, and delivered on time. Highly recommended.", avatar: "OR" },
      { name: "Daniel K.", institution: "London Business School", rating: 5, quote: "Great communication and top-quality work. She helped me score an A+ on my dissertation proposal!", avatar: "DK" }
    ]
  },
  {
    id: "emily-carter",
    name: "Dr. Emily Carter",
    role: "Accounting Expert",
    avatar: "EC",
    rating: 4.9,
    reviewCount: 42,
    ordersCompleted: 2450,
    ordersInProgress: 12,
    location: "London, UK",
    successRate: 99,
    expertise: ["Financial Accounting", "Management Accounting", "Auditing", "Corporate Finance"],
    qualifications: "Ph.D. in Accounting, MBA",
    experience: "8+ Years",
    skills: ["Financial Accounting", "Tax Accounting", "Auditing", "Cost Valuation"],
    helpsWith: ["Accounting Assignment", "Financial Analysis", "Balance Sheet Reports", "Case Study"],
    about: [
      "Dr. Emily Carter is a senior chartered accountant and academic scholar who guides students in standard accounting conventions. She simplifies double-entry ledger entries, cash flow calculations, and strategic corporate audits.",
      "She holds an MBA from Oxford and a Ph.D. from London School of Economics, combining practical accounting with high academic rigor."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Accounting, LSE" },
      { label: "Credentials", value: "ACCA, Certified Auditor" }
    ],
    reviews: []
  },
  {
    id: "james-wilson",
    name: "Prof. James Wilson",
    role: "Finance Expert",
    avatar: "JW",
    rating: 4.8,
    reviewCount: 38,
    ordersCompleted: 3170,
    ordersInProgress: 15,
    location: "Manchester, UK",
    successRate: 97,
    expertise: ["Corporate Finance", "Investment Analysis", "Financial Modeling", "Portfolio Management"],
    qualifications: "Ph.D. in Finance",
    experience: "10+ Years",
    skills: ["Financial Analysis", "Stochastic Modeling", "Econometrics", "Risk Management"],
    helpsWith: ["Dissertation", "Research Project", "Valuation Report", "Excel Modeling"],
    about: [
      "Prof. James Wilson specializes in complex corporate valuation modeling, option pricing theory, and stock analysis reports. He helps students master investment analytics and academic finance theses."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Finance, Cambridge" }
    ],
    reviews: []
  },
  {
    id: "sophia-martinez",
    name: "Dr. Sophia Martinez",
    role: "Business Expert",
    avatar: "SM",
    rating: 4.9,
    reviewCount: 19,
    ordersCompleted: 2890,
    ordersInProgress: 9,
    location: "Edinburgh, UK",
    successRate: 98,
    expertise: ["Business Strategy", "Marketing", "Organizational Behavior", "HRM"],
    qualifications: "Ph.D. in Business Administration",
    experience: "7+ Years",
    skills: ["Strategic Analysis", "Swot Analysis", "Case Study Method", "Leadership Frameworks"],
    helpsWith: ["Business Report", "Case Analysis", "Management Essay", "Dissertation"],
    about: [
      "Dr. Sophia Martinez brings strategic business planning to your screen. She specializes in corporate governance, change management, and international expansion strategy assignments."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Business, University of Edinburgh" }
    ],
    reviews: []
  },
  {
    id: "daniel-harris",
    name: "Dr. Daniel Harris",
    role: "Economics Expert",
    avatar: "DH",
    rating: 4.7,
    reviewCount: 33,
    ordersCompleted: 1960,
    ordersInProgress: 4,
    location: "Bristol, UK",
    successRate: 96,
    expertise: ["Microeconomics", "Macroeconomics", "Econometrics", "Game Theory"],
    qualifications: "Ph.D. in Economics",
    experience: "6+ Years",
    skills: ["Stata Analysis", "R-Studio", "Econometric Regression", "Monetary Policy Analysis"],
    helpsWith: ["Economics Essay", "Quantitative Report", "Math Modeling", "Homework"],
    about: [
      "Dr. Daniel Harris helps students parse complex micro-economic structures and apply macroeconomic equations. He is proficient in statistical software packages like Stata, R, and SPSS."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Economics, Bristol University" }
    ],
    reviews: []
  },
  {
    id: "olivia-bennett",
    name: "Dr. Olivia Bennett",
    role: "Management Expert",
    avatar: "OB",
    rating: 4.9,
    reviewCount: 29,
    ordersCompleted: 1750,
    ordersInProgress: 8,
    location: "Birmingham, UK",
    successRate: 99,
    expertise: ["Human Resource Management", "Leadership Studies", "Operations Management"],
    qualifications: "Ph.D. in Management",
    experience: "6+ Years",
    skills: ["HR Policy Frameworks", "Lean Operations", "Supply Chain Modeling", "Conflict Management"],
    helpsWith: ["HR Case Study", "Operations Report", "Dissertation", "Reflective Essay"],
    about: [
      "Dr. Olivia Bennett guides students through strategic operations layouts, modern human resource optimization methodologies, and project management coursework."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Management, University of Birmingham" }
    ],
    reviews: []
  },
  {
    id: "william-taylor",
    name: "Dr. William Taylor",
    role: "Marketing Expert",
    avatar: "WT",
    rating: 4.8,
    reviewCount: 27,
    ordersCompleted: 2100,
    ordersInProgress: 6,
    location: "Leeds, UK",
    successRate: 97,
    expertise: ["Digital Marketing", "Consumer Behavior", "Brand Management", "SEO & Content strategy"],
    qualifications: "Ph.D. in Marketing",
    experience: "8+ Years",
    skills: ["Social Media Campaigns", "Brand Audits", "SEO Reporting", "Marketing Funnel Analysis"],
    helpsWith: ["Marketing Plan", "Consumer Survey Report", "Advertising Analysis", "Assignment"],
    about: [
      "Dr. William Taylor focuses on modern digital marketing execution, brand positioning metrics, and quantitative consumer behavior analyses."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Marketing, Leeds University" }
    ],
    reviews: []
  },
  {
    id: "charlotte-lewis",
    name: "Dr. Charlotte Lewis",
    role: "Law Expert",
    avatar: "CL",
    rating: 4.9,
    reviewCount: 31,
    ordersCompleted: 1620,
    ordersInProgress: 7,
    location: "Oxford, UK",
    successRate: 98,
    expertise: ["Contract Law", "Criminal Law", "International Law", "Jurisprudence"],
    qualifications: "Ph.D. in Law",
    experience: "9+ Years",
    skills: ["Legal Briefs", "OSCOLA Citations", "Case Law Analysis", "Statutory Interpretation"],
    helpsWith: ["Law Case Analysis", "Contract Essays", "Dissertation Writing", "Moot Court Notes"],
    about: [
      "Dr. Charlotte Lewis is an academic law tutor specializing in UK common law, corporate law structures, and European union legislation. She teaches rigorous OSCOLA citation layout."
    ],
    credentials: [
      { label: "Degree", value: "Ph.D. in Law, Oxford University" }
    ],
    reviews: []
  }
];

export const SERVICES: Service[] = [];

export const SUBJECTS: Subject[] = [
  {
    slug: "accounting",
    name: "Accounting",
    iconName: "Calculator",
    orderCount: "7,400+",
    sampleCount: 152,
    letterBadge: "A",
    letterColorClass: "bg-purple-100 text-purple-700",
    assignmentsDelivered: "25,000+",
    expertsCount: "150+",
    rating: "4.9/5",
    onTimeDelivery: "98%",
    roleName: "Accounting Expert",
    professionalsWord: "accounting professionals",
    standardsWord: "accounting standards",
    analyticalWord: "precision and analytical thinking"
  },
  {
    slug: "business",
    name: "Business Management",
    iconName: "Briefcase",
    orderCount: "12,500+",
    sampleCount: 87,
    letterBadge: "B",
    letterColorClass: "bg-indigo-100 text-indigo-700",
    assignmentsDelivered: "45,000+",
    expertsCount: "320+",
    rating: "4.9/5",
    onTimeDelivery: "99%",
    roleName: "Business Expert",
    professionalsWord: "business professionals",
    standardsWord: "management standards",
    analyticalWord: "strategic vision and critical analysis"
  },
  {
    slug: "economics",
    name: "Economics",
    iconName: "BarChart2",
    orderCount: "4,200+",
    sampleCount: 45,
    letterBadge: "E",
    letterColorClass: "bg-green-100 text-green-700",
    assignmentsDelivered: "18,000+",
    expertsCount: "110+",
    rating: "4.8/5",
    onTimeDelivery: "97%",
    roleName: "Economics Expert",
    professionalsWord: "economics professionals",
    standardsWord: "economic research standards",
    analyticalWord: "quantitative research and data analysis"
  },
  {
    slug: "law",
    name: "Law",
    iconName: "Scale",
    orderCount: "8,600+",
    sampleCount: 60,
    letterBadge: "L",
    letterColorClass: "bg-blue-100 text-blue-700",
    assignmentsDelivered: "32,000+",
    expertsCount: "240+",
    rating: "4.9/5",
    onTimeDelivery: "98%",
    roleName: "Law Expert",
    professionalsWord: "legal professionals",
    standardsWord: "OSCOLA and UK legal standards",
    analyticalWord: "critical legal reasoning and statutory interpretation"
  },
  {
    slug: "marketing",
    name: "Marketing",
    iconName: "Megaphone",
    orderCount: "5,800+",
    sampleCount: 65,
    letterBadge: "M",
    letterColorClass: "bg-pink-100 text-pink-700",
    assignmentsDelivered: "22,000+",
    expertsCount: "140+",
    rating: "4.8/5",
    onTimeDelivery: "98%",
    roleName: "Marketing Expert",
    professionalsWord: "marketing professionals",
    standardsWord: "industry marketing frameworks",
    analyticalWord: "market research and consumer insights"
  },
  {
    slug: "nursing",
    name: "Nursing",
    iconName: "HeartPulse",
    orderCount: "9,800+",
    sampleCount: 74,
    letterBadge: "N",
    letterColorClass: "bg-teal-100 text-teal-700",
    assignmentsDelivered: "29,000+",
    expertsCount: "180+",
    rating: "4.9/5",
    onTimeDelivery: "99%",
    roleName: "Nursing Expert",
    professionalsWord: "healthcare and nursing professionals",
    standardsWord: "NMC and clinical guidelines",
    analyticalWord: "evidence-based practice and clinical safety"
  },
  {
    slug: "psychology",
    name: "Psychology",
    iconName: "Brain",
    orderCount: "6,300+",
    sampleCount: 81,
    letterBadge: "P",
    letterColorClass: "bg-rose-100 text-rose-700",
    assignmentsDelivered: "15,000+",
    expertsCount: "95+",
    rating: "4.8/5",
    onTimeDelivery: "98%",
    roleName: "Psychology Expert",
    professionalsWord: "psychology professionals",
    standardsWord: "APA formatting and ethical guidelines",
    analyticalWord: "empirical research and behavioral analysis"
  },
  {
    slug: "history",
    name: "History",
    iconName: "History",
    orderCount: "3,100+",
    sampleCount: 30,
    letterBadge: "H",
    letterColorClass: "bg-amber-100 text-amber-700",
    assignmentsDelivered: "12,000+",
    expertsCount: "75+",
    rating: "4.7/5",
    onTimeDelivery: "97%",
    roleName: "History Expert",
    professionalsWord: "historians and researchers",
    standardsWord: "historiographical methodologies",
    analyticalWord: "critical source evaluation and archival research"
  }
];

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

export const SAMPLES: Sample[] = [
  {
    title: "Comparative Corporate Governance Structures in FTSE 100 Companies",
    subject: "Business Report",
    image: "/new-home-page-images/Business-Report.webp",
    href: "/samples"
  },
  {
    title: "Evaluating Patient Outcomes in ICU Transitional Nursing Protocols",
    subject: "Nursing Essay",
    image: "/new-home-page-images/Nursing-Essay.webp",
    href: "/samples"
  },
  {
    title: "Statutory Analysis of Property Rights under the Land Registration Act 2002",
    subject: "Law Case Study",
    image: "/new-home-page-images/Law-Case-Study.webp",
    href: "/samples"
  },
  {
    title: "Impact of Micro-Influencer Campaigns on Gen-Z Brand Engagement",
    subject: "Marketing Plan",
    image: "/new-home-page-images/Essay-Writing.webp",
    href: "/samples"
  },
  {
    title: "Optimized Pathfinding Algorithms in High-Density Logistics Simulations",
    subject: "Computer Science",
    image: "/new-home-page-images/Report-Writing.webp",
    href: "/samples"
  },
  {
    title: "Socio-Economic Repercussions of Public Health Mandates in Urban Centers",
    subject: "Research Proposal",
    image: "/new-home-page-images/Reseacrh-Proposal.webp",
    href: "/samples"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How to Write an Academic Essay That Earns Top Marks",
    excerpt: "Discover the structure, research sources, and writing tips UK students need to craft essays that impress instructors and secure high grades.",
    date: "12 Jul 2025",
    image: "/new-blog-images/65fc013af2f56_Essay-Writing-Service-UK-960x512.jpg",
    href: "/blog/how-to-write-an-academic-essay"
  },
  {
    title: "Inquiry-Based Learning: Boost Your Critical Thinking",
    excerpt: "Explore how inquiry-led research assignments can elevate your academic work, from questions to evidence and argument development.",
    date: "09 Jun 2025",
    image: "/new-blog-images/65fc05c672519_Inquiry-Based-Learning-Blog-Pic-1200x480.png",
    href: "/blog/inquiry-based-learning-guide"
  },
  {
    title: "Harvard Referencing Made Simple for UK Students",
    excerpt: "A practical guide to referencing styles, in-text citations, and bibliography formatting for essays, reports, and dissertations.",
    date: "02 May 2025",
    image: "/new-blog-images/65fbf5eea1f06_blog9484-1195x480.jpg",
    href: "/blog/harvard-referencing-guide"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Emily R.",
    institution: "University of Leeds",
    quote: "The assignment was well-structured and perfectly written. It helped me understand the topic better and I scored 85%. Highly recommended!",
    rating: 5,
    avatar: "/assets/media/avatars/150-5.jpg"
  },
  {
    name: "James L.",
    institution: "University of Manchester",
    quote: "Excellent experience! The writer understood my requirements perfectly. Delivered before the deadline and the quality was outstanding.",
    rating: 5,
    avatar: "/assets/media/avatars/150-2.jpg"
  },
  {
    name: "Sophie M.",
    institution: "King's College London",
    quote: "Great communication and quick responses. The assignment was original and followed all the guidelines. Will definitely order again!",
    rating: 5,
    avatar: "/assets/media/avatars/150-3.jpg"
  }
];

export const FAQS: FAQ[] = [
  {
    question: "Is academic assignment writing help legal in the UK?",
    answer: "Yes, our academic support services are completely legal. We provide model answers, custom research, proofreading, and editing support designed to be used as study aids and reference guidelines. Students use our materials to better understand their assignments, structure, and referencing requirements."
  },
  {
    question: "How fast can you deliver my assignment order?",
    answer: "Our expert writers can handle urgent assignments, with delivery deadlines starting from as short as 6 hours. However, we recommend ordering as early as possible to allow ample time for revisions and to get the most competitive pricing rates."
  },
  {
    question: "Will my custom assignment be plagiarism-free?",
    answer: "Absolutely. Every single assignment is written from scratch by a dedicated subject expert. We pass all papers through advanced plagiarism checkers like Turnitin and provide a complete plagiarism report with your order to guarantee its absolute uniqueness."
  },
  {
    question: "Can I directly communicate with my matched expert?",
    answer: "Yes! Our platform features a direct message system allowing you to communicate adjustments, upload extra course materials, and track progress milestones directly with your academic expert throughout the writing process."
  },
  {
    question: "Do you offer free unlimited revisions?",
    answer: "Yes, student satisfaction is our priority. If the delivered draft requires changes, you can request unlimited revisions within 14 days of receipt, and your matched expert will adjust the document to match your original specifications absolutely free."
  }
];
