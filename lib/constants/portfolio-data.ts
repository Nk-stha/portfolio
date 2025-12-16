import type {
    NavLink,
    ProcessStep,
    Experience,
    Project,
    Testimonial,
    BlogPost,
    SocialLink,
} from "../types/portfolio";

export const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Process", href: "#services" },
    { label: "Resume", href: "#resume" },
    { label: "Project", href: "#projects" },
    { label: "Contact Us", href: "#contact" },
];

export const PROCESS_STEPS: ProcessStep[] = [
    {
        id: 1,
        icon: "lightbulb",
        title: "Discovery & Planning",
        description:
            "Defining the roadmap. We align technical requirements with business goals to build a solid foundation.",
        items: ["Requirement Analysis", "Tech Stack Selection", "Architecture Design"],
    },
    {
        id: 2,
        icon: "design_services",
        title: "Design & Prototyping",
        description:
            "Visualizing the solution. Translating ideas into interactive prototypes and high-fidelity UI designs.",
        items: ["UI/UX Wireframing", "Interactive Prototypes", "Database Schema Design"],
    },
    {
        id: 3,
        icon: "code",
        title: "Dev & Implementation",
        description:
            "Building the core. Writing clean, efficient, and scalable code for both frontend and backend systems.",
        items: ["API Development", "Frontend Integration", "Microservices Setup"],
    },
    {
        id: 4,
        icon: "rocket_launch",
        title: "Deploy & Maintenance",
        description:
            "Launch and sustain. Ensuring smooth deployment to production and ongoing system health.",
        items: ["CI/CD Pipelines", "Cloud Infrastructure", "Performance Monitoring"],
    },
];

export const EXPERIENCES: Experience[] = [
    {
        id: 1,
        company: "Senior Engineer, TechFlow",
        period: "Sep 2021 - Present",
        role: "Lead Full Stack Developer",
        description:
            "Architected a microservices-based e-commerce platform handling 50k requests/sec. Led a team of 6 developers in migrating legacy monolith to Node.js and React.",
        isPrimary: true,
    },
    {
        id: 2,
        company: "Innovate Corp",
        period: "Aug 2018 - Sep 2021",
        role: "Backend Developer",
        description:
            "Developed RESTful APIs using Python/Django. Optimized database queries reducing load times by 40%. Implemented CI/CD pipelines with Jenkins.",
    },
    {
        id: 3,
        company: "StartUp Studio",
        period: "Jun 2016 - Aug 2018",
        role: "Web Developer",
        description:
            "Built responsive websites for various clients using HTML, CSS, and JavaScript. Collaborated with designers to ensure pixel-perfect implementation.",
        isPrimary: true,
    },
];

export const PROJECTS: Project[] = [
    {
        id: 1,
        title: "FinTech Dashboard",
        description: "React, Node.js, PostgreSQL",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCjubuuQy8tTWqgt9IEzNYMeL6I299ivU5ID7_0Y5RPkVs1jlYc_-WgFVwID-cSK9I3opGh1wD4jFKfjMKxSzpvLW_xXt8I2DrCvbLMl_M5y_3RXeC9wL6T1i1i1eBdK023EU3Nr87JO2nRGyUo6xLTAht721zZ901HT5AJgoIASe29y8q6gkH6S18M4sivWtmfVA39OQoIR48fBabj4fWvRXJjyPMMG3Mpd0hf2ZoUvzO_6rGBJLh38i1NhB44o2Oc_4SfStUqHXo",
        tags: ["Secure", "Real-time"],
        category: "saas",
    },
    {
        id: 2,
        title: "Food Delivery App",
        description: "React Native, Firebase, Google Maps API",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuARZtw5R6e1ouvqRHdge06MLRv1WFjtVeojT4UfZuWb1g1Y9kx2uRvfOK6tgkr4jr4TP8rPOWs3h445qYrnrB2wMS0jbFz0VZaZXmV1sfSX9fzrJSDyzcaTBdipu3lXDgca0zOlpuzdrIkrQxD3-FNFV-_MVWhhQCLWRWNESlAWzlO9ZuLw3Ea8eY1em8j4qoBhskFOSD8mqvJSR3w4NtlFGb0FTv9iebZHgV70-3BE1RCx5EZYIN7WE-lOLFO5oLpixGrR1VdvQfw",
        tags: ["iOS/Android", "Geo-Location"],
        category: "mobile",
    },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Henry, Arthur",
        role: "CTO",
        company: "FinTech Global",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDea3VwKMM8QDge66UovbC9V6c3AEvn0f8sjYjvoKJ6zF4XhJUr1MoGM29mbibg1nZJaDuUKmAma0z1s2I7pOQ31B_K9Qptm3oUdudE0vFB36OHI_tI1V_lfWXMrGRMPJhU0tIBp-6SSG9tK8zRJTM2PpesdBdlqlns5U1r6AzomITWlEDu_9boALZ3lXEZkug0pBQm943WSr7kTPVtg2V8PDvNIWtQ0kaZUPRDyzNaEOuAjfyeoVXQaw0iggLK_kxqCHeBrVzzXWA",
        rating: 5.0,
        quote:
            "Jenny is a rare find. She not only understands complex backend logic but also has an eye for frontend detail. She refactored our entire payment gateway integration in half the expected time.",
        isPrimary: true,
    },
    {
        id: 2,
        name: "Joshua, Arthur",
        role: "Product Lead",
        company: "StartUp Inc",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAo_rL6xPp7DbD4rMGNJ5kCkkdh39fXThH5wal2rPgxW4D8X-L-27T-wMT4Ex5pFvN9_9Zqqj1glL3Ie9w2909t2LBx1FpctJR4XWShwCCh7SgehOWDc93VcC1SoHLIX7RPrMopTW-uroP5UED-NUnerHcBHGvWhxRaAqRr_uMUg5C2kNFzYyIxkH69C12uiszeZpziRxv88xJCnWHhgUts0-BG3ONx8cmwbo16zfb1j4fMmEzu2V23KivYaBBCH8ECR5UJCOFMw_A",
        rating: 5.0,
        quote:
            "Working with Jenny was seamless. Her communication is excellent, and her code quality is top-tier. She delivered our MVP ahead of schedule with zero critical bugs.",
    },
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "Microservices vs Monolith: Choosing the Right Arch",
        category: "Backend",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBEHqzr6FiO0DVK2KSVIINugsmyKOGpQWlG00sXnuzwDgw-1z9InmTO4KthCWKRQE60HHN8NnaYoHnlVZ0sPlLtXaXcPEA6yu7WmNYjijYogo9DxE_Wb1_6N67HWh2WYjdmOTsC54HvWjIPrkiYCNDXSNgnujjWefE25yVCIjPMM9H2hufrfjMmVzvxjvuIOgVkDlTqOisqrp6T3P3PMQxXh-7kIF5tTPbi8K47XxekgCI6EjkjwoOybn4m3ts27bM_e1aMoyUSn-Q",
        author: "Jenny Smith",
        date: "22 July 2023",
    },
    {
        id: 2,
        title: "Mastering React Hooks for Cleaner Code",
        category: "Frontend",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDRkLKOeZd3WKBl0QqLa7p3SnfPIzpo3JrV-nERfdZnwi4OMLP7DBir2nyHI_-jBUxnQKnUh77bFwu-m3ABxtbdvC97V2kZT7f_hR8ryXq8M-e_tJunE186cpV3Ox4qQK5L4naElGMNbxqTyXbyquEqi1U-UH5QCDdnHcjd-oS8RHOzNu1u7Q1taree1lNYK8R8Fr5iJ0526e7JjVzr2ruNFJk7xGBbcag-f8-ACYw7f3TAF_2UE1fFTaCHa0Z5FdefgRMzvg5mcfU",
        author: "Jenny Smith",
        date: "15 Aug 2023",
        isPrimary: true,
    },
    {
        id: 3,
        title: "Best Practices for Securing REST APIs",
        category: "Security",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBCMSs52ogzMQTNOkn8KiSZO6Yyu7lqLqr5YhX_4T3gLDgmWUrXcli7RREPUrKNPeieUr8rAIHcH8FE1qg5OdRC1iQ29ke1JRLKHaNnn4LKfEMjc2hhYeuSKlgE-BHZp1m_sQu8RwiY-oADbgMCCYBcFQ1apJbYlbHgTUmHqFpL67lFVuKIjXxvHA0gWDBG16jJmECxR1QYbkLVYN4rpSMEL2wXwmzx19cZARJuHPZrmzwGQLUxlnFEWUFBKqn9rjoF1SCbWMxiAJo",
        author: "Jenny Smith",
        date: "02 Sept 2023",
    },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { platform: "Facebook", icon: "facebook", href: "#" },
    { platform: "GitHub", icon: "code", href: "#" },
    { platform: "YouTube", icon: "smart_display", href: "#" },
    { platform: "Email", icon: "alternate_email", href: "#" },
];

export const FOOTER_NAV: NavLink[] = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Service", href: "#" },
    { label: "Resume", href: "#" },
    { label: "Project", href: "#" },
];
