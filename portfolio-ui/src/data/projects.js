export const projects = [
  {
    id: "corewise",
    title: "CoreWise",
    subtitle: "Graduation Project",
    categories: ["Web Development", "AI & Automation", "Backend"],
    description: "Built a multi-tenant HR & payroll platform for the MENA region with role-based access control and full Arabic/English/French localization.",
    problem: "HR processes involve heavy manual labor, from candidate screening to attendance tracking, which is time-consuming and error-prone.",
    solution: "Developed a comprehensive automated system integrating AI tools to streamline these HR processes from hours to minutes.",
    technologies: ["Laravel", "n8n", "AI", "Multi-tenant"],
    features: [
      "Integrated AI automation workflows using n8n",
      "AI-powered ATS (Applicant Tracking System)",
      "RAG-based HR chatbot",
      "Real-time chat & Kanban tracking",
      "GPS-based attendance tracking"
    ],
    github: null,
    demoLink: null,
    featured: true,
    image: null,
    visualColor: "from-blue-500 to-indigo-600",
    iconName: "TbUsers"
  },
  {
    id: "fsoal",
    title: "Fsoal (Fosool)",
    subtitle: "EdTech Platform",
    categories: ["Web Development", "Backend"],
    description: "Designed a bilingual learning platform for teachers and students, with role-based Filament admin panels, class booking, an auto-graded quiz engine, live video sessions, and online payments. Live in production.",
    problem: "Educators need a centralized, seamless platform that handles everything from live teaching to automated grading and payment collection.",
    solution: "Created an all-in-one EdTech solution empowering educators to manage their workflow effortlessly while providing students an engaging learning experience.",
    technologies: ["Laravel", "Filament", "Payment Integration"],
    features: [
      "Role-based access via Filament admin panels",
      "Class booking system",
      "Auto-graded quiz engine",
      "Live video sessions",
      "Secure online payments"
    ],
    github: null,
    demoLink: "https://fsoal.sys-web.net",
    featured: true,
    image: "/fsoal.png",
    visualColor: "from-purple-500 to-pink-600",
    iconName: "TbBulb"
  },
  {
    id: "taqawi",
    title: "Taqawi",
    subtitle: "Corporate & Investor Platform",
    categories: ["Web Development", "Backend"],
    description: "Built a bilingual platform combining a Laravel REST API, a React public site, and a Next.js admin dashboard for investor relations, financial documents, and content management, with role-based access and interactive analytics dashboards.",
    problem: "Enterprises require secure, scalable, and highly performant platforms to present financial data to investors while maintaining a powerful CMS for internal teams.",
    solution: "Designed a decoupled architecture utilizing Laravel for the core API and modern frontend frameworks for blazing-fast user experiences.",
    technologies: ["Laravel", "React", "Next.js", "REST API"],
    features: [
      "Bilingual public site built with React",
      "Next.js admin dashboard",
      "Role-based access control",
      "Interactive analytics dashboards",
      "Secure financial document management"
    ],
    github: null,
    demoLink: null,
    featured: true,
    image: null,
    visualColor: "from-teal-400 to-emerald-600",
    iconName: "TbBrain"
  },
  {
    id: "masarat",
    title: "Masarat",
    subtitle: "Educational Platform",
    categories: ["Web Development", "Backend"],
    description: "Built and deployed a live e-learning platform where students can enroll in courses, track their progress, and interact with instructors. Reached 187 students during its pilot launch.",
    problem: "Needed a scalable e-learning solution to validate a new educational model quickly and effectively.",
    solution: "Delivered a streamlined Laravel platform focused on core learning functionalities, successfully onboarding nearly 200 students during the pilot.",
    technologies: ["Laravel", "E-learning"],
    features: [
      "Course enrollment and progress tracking",
      "Instructor interaction",
      "Scalable database architecture"
    ],
    github: null,
    demoLink: "https://masarat-platform.fly.dev",
    featured: false,
    image: "/masarat.png",
    visualColor: "from-cyan-500 to-blue-500",
    iconName: "TbMessages"
  },
  {
    id: "anany",
    title: "Anany Audit & Assurance Office",
    subtitle: "Corporate CMS",
    categories: ["Web Development", "Backend"],
    description: "Built a bilingual corporate CMS with role-based access control, integrated with Meilisearch search, automated email notifications, and a real-time admin analytics dashboard. Live in production.",
    problem: "A high-profile audit firm required a professional digital presence with complex internal content management needs.",
    solution: "Implemented a robust CMS tailored for corporate content, featuring ultra-fast search and automated communication workflows.",
    technologies: ["Laravel", "Meilisearch", "CMS"],
    features: [
      "Bilingual interface",
      "Meilisearch integration for ultra-fast search",
      "Automated email notifications",
      "Real-time admin analytics dashboard"
    ],
    github: null,
    demoLink: "https://anany.eg",
    featured: false,
    image: "/anany.png",
    visualColor: "from-amber-500 to-orange-600",
    iconName: "TbApi"
  },
  {
    id: "afaq",
    title: "Afaq Store",
    subtitle: "Modular E-commerce",
    categories: ["Web Development", "Backend", "APIs & Integrations"],
    description: "Collaborated with Afaq Store as part of the development team to build a modular e-commerce platform with a RESTful API secured via OAuth2, a Filament admin panel, and integrated push notifications and live video support. Live in production.",
    problem: "Growing e-commerce operations need modular systems that can scale and support modern engagement tools like live video and push notifications.",
    solution: "Contributed to a secure, API-first architecture using OAuth2 and Filament to provide a scalable foundation for the business.",
    technologies: ["Laravel", "OAuth2", "Filament", "E-commerce"],
    features: [
      "RESTful API secured via OAuth2",
      "Modular e-commerce architecture",
      "Filament admin panel",
      "Integrated push notifications",
      "Live video support"
    ],
    github: null,
    demoLink: "https://afaq-stores.com",
    featured: false,
    image: "/afaq.png",
    visualColor: "from-rose-500 to-red-600",
    iconName: "TbRobot"
  }
];

export const categories = [
  "All",
  "Featured",
  "Web Development",
  "Backend",
  "AI & Automation",
  "APIs & Integrations"
];
