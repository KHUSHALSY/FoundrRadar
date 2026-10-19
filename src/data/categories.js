export const PROFESSIONAL_TOPICS = [
  { label: "AI & Autonomous Agents", query: "artificial intelligence LLM GenAI \"AI agents\"" },
  { label: "B2B SaaS & Cloud", query: "\"B2B SaaS\" enterprise software cloud" },
  { label: "FinTech & Payments", query: "fintech payments \"neo bank\" defi banking" },
  { label: "D2C & Consumer Tech", query: "D2C consumer brand retail ecommerce" },
  { label: "Venture Capital & Angels", query: "\"angel investor\" OR \"venture capital\" OR \"managing partner\"" },
  { label: "Developer Tools & Open Source", query: "\"developer tools\" devtools API open-source" },
  { label: "ClimateTech & Clean Energy", query: "climatetech cleantech sustainability EV renewable" },
  { label: "HealthTech & BioTech", query: "healthtech biotech healthcare telemedicine medtech" },
  { label: "Cybersecurity & Web3", query: "cybersecurity infosec crypto web3 blockchain" },
  { label: "Creator Economy & Media", query: "\"creator economy\" streaming media gaming newsletter" }
];

export const TARGET_ROLES = [
  { id: "founder", label: "Founder / Co-Founder / CEO", query: '("Founder" OR "Co-Founder" OR "CEO")' },
  { id: "investor", label: "Angel Investor / VC Partner", query: '("Angel Investor" OR "Venture Capital" OR "Managing Partner" OR "General Partner")' },
  { id: "speaker", label: "Keynote Speaker / Conference Panelist", query: '("Keynote Speaker" OR "Founder" OR "Thought Leader" OR "Author")' },
  { id: "cto", label: "CTO / VP Engineering / Tech Architect", query: '("CTO" OR "Chief Technology Officer" OR "VP Engineering" OR "Head of Engineering")' },
  { id: "cmo", label: "CMO / Head of Growth & Marketing", query: '("CMO" OR "Chief Marketing Officer" OR "VP Growth" OR "Head of Marketing")' },
  { id: "product", label: "CPO / VP Product / Product Lead", query: '("Chief Product Officer" OR "VP Product" OR "Head of Product")' }
];

export const BACKGROUND_FILTERS = [
  { id: "any", label: "Any Background", query: "" },
  { id: "yc", label: "Y Combinator / Techstars Alums", query: '("Y Combinator" OR "YC W" OR "YC S" OR "Techstars")' },
  { id: "top_tier", label: "Top Tier Universities (Stanford, MIT, IIT, Harvard)", query: '("Stanford" OR "MIT" OR "Harvard" OR "IIT" OR "Berkeley")' },
  { id: "ex_faang", label: "Ex-FAANG / Big Tech Operators", query: '("Ex-Google" OR "Ex-Meta" OR "Ex-Amazon" OR "Ex-Apple" OR "Ex-Microsoft")' },
  { id: "serial", label: "Serial Founders & Repeat Entrepreneurs", query: '("Serial Entrepreneur" OR "2x Founder" OR "Second-time Founder" OR "Exited Founder")' },
  { id: "bootstrapped", label: "Bootstrapped / Indie Hackers", query: '("Bootstrapped" OR "Indie Hacker" OR "MicroConf" OR "Profitable")' }
];

export const GEOGRAPHY_PRESETS = [
  { id: "global", label: "Global / Worldwide", query: "" },
  { id: "us", label: "United States (SF / NYC / Austin / Seattle)", query: '("San Francisco" OR "New York" OR "Austin" OR "Silicon Valley" OR "Seattle" OR "United States")' },
  { id: "india", label: "India (Bengaluru / Delhi NCR / Mumbai)", query: '("Bengaluru" OR "Bangalore" OR "Delhi NCR" OR "Gurugram" OR "Mumbai" OR "India")' },
  { id: "europe", label: "Europe & UK (London / Berlin / Amsterdam)", query: '("London" OR "Berlin" OR "Amsterdam" OR "Paris" OR "United Kingdom" OR "Europe")' },
  { id: "remote", label: "Remote / Distributed Teams", query: '("Remote" OR "Distributed" OR "Work from anywhere")' }
];
