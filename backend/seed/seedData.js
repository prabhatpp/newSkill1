require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Solution = require('../models/Solution');
const Book = require('../models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentplatform';

const courses = [
  {
    title: 'B.Tech / Engineering',
    stream: 'Science',
    description: 'Bachelor of Technology covers computer science, mechanical, civil, electrical and other engineering branches. One of the most sought-after courses for PCM students.',
    duration: '4 Years',
    eligibility: 'Class 12 with PCM, min 75% marks',
    careerScope: 'Software Engineer, Mechanical Engineer, Civil Engineer, Data Scientist',
    entranceExam: 'JEE Main / JEE Advanced',
    universities: ['IITs', 'NITs', 'BITS Pilani', 'VIT', 'SRM']
  },
  {
    title: 'MBBS / Medical',
    stream: 'Science',
    description: 'Bachelor of Medicine and Bachelor of Surgery is the gateway to becoming a doctor. Requires strong biology and chemistry foundation.',
    duration: '5.5 Years (including internship)',
    eligibility: 'Class 12 with PCB, min 50% marks',
    careerScope: 'Doctor, Surgeon, Specialist, Medical Researcher',
    entranceExam: 'NEET-UG',
    universities: ['AIIMS', 'JIPMER', 'CMC Vellore', 'Government Medical Colleges']
  },
  {
    title: 'B.Sc (Pure Sciences)',
    stream: 'Science',
    description: 'Bachelor of Science in Physics, Chemistry, Mathematics or Biology. Great foundation for research, teaching or further studies like MSc or PhD.',
    duration: '3 Years',
    eligibility: 'Class 12 with Science stream',
    careerScope: 'Scientist, Researcher, Lecturer, Data Analyst',
    entranceExam: 'Merit / University Entrance',
    universities: ['Delhi University', 'JNU', 'IISc', 'Banaras Hindu University']
  },
  {
    title: 'Chartered Accountancy (CA)',
    stream: 'Commerce',
    description: 'CA is one of the most prestigious finance qualifications in India, offered by ICAI. It covers accounting, taxation, auditing and finance management.',
    duration: '4-5 Years',
    eligibility: 'Class 12 (any stream), CA Foundation exam',
    careerScope: 'Chartered Accountant, Financial Advisor, Tax Consultant, CFO',
    entranceExam: 'CA Foundation',
    universities: ['ICAI (Institute of Chartered Accountants of India)']
  },
  {
    title: 'B.Com / BBA',
    stream: 'Commerce',
    description: 'Bachelor of Commerce or Business Administration provides a strong foundation in business, finance, marketing and management.',
    duration: '3 Years',
    eligibility: 'Class 12 with Commerce, min 50% marks',
    careerScope: 'Business Manager, Banker, HR Manager, Entrepreneur',
    entranceExam: 'Merit / DU JAT / IPM',
    universities: ['Delhi University', 'Christ University', 'Symbiosis', 'IIM Indore (IPM)']
  },
  {
    title: 'LLB / Law',
    stream: 'Commerce',
    description: 'Bachelor of Laws (integrated 5-year BA LLB or 3-year LLB after graduation). Opens doors to legal practice, judiciary, and corporate law.',
    duration: '5 Years (integrated) / 3 Years (after graduation)',
    eligibility: 'Class 12 (any stream), 45% marks',
    careerScope: 'Lawyer, Judge, Legal Advisor, Corporate Counsel',
    entranceExam: 'CLAT / AILET / LSAT',
    universities: ['NLSIU Bangalore', 'NLU Delhi', 'NALSAR Hyderabad', 'Symbiosis Law School']
  },
  {
    title: 'BA / Liberal Arts',
    stream: 'Arts',
    description: 'Bachelor of Arts covers History, Political Science, Sociology, Psychology, Literature and more. Excellent for civil services, journalism and social work.',
    duration: '3 Years',
    eligibility: 'Class 12 (any stream)',
    careerScope: 'IAS/IPS Officer, Journalist, Social Worker, Teacher, Writer',
    entranceExam: 'Merit / CUET',
    universities: ['Delhi University', 'JNU', 'Jadavpur University', 'Hyderabad Central University']
  },
  {
    title: 'B.Design / NID',
    stream: 'Arts',
    description: 'Bachelor of Design in fashion, graphic, product or interior design. Creative career path for artistic students.',
    duration: '4 Years',
    eligibility: 'Class 12 (any stream), creative aptitude',
    careerScope: 'Graphic Designer, UI/UX Designer, Fashion Designer, Product Designer',
    entranceExam: 'NID DAT / NIFT / CEED',
    universities: ['NID Ahmedabad', 'NIFT Delhi', 'MIT Institute of Design', 'Srishti Institute']
  },
  {
    title: 'B.Arch / Architecture',
    stream: 'Science',
    description: 'Bachelor of Architecture is a 5-year professional degree for designing buildings, spaces and environments. Combines creativity with technical knowledge of construction.',
    duration: '5 Years',
    eligibility: 'Class 12 with Maths, min 50% marks',
    careerScope: 'Architect, Urban Planner, Interior Designer, Landscape Architect',
    entranceExam: 'NATA / JEE Paper 2',
    universities: ['SPA Delhi', 'IIT Roorkee', 'CEPT Ahmedabad', 'Jamia Millia Islamia']
  },
  {
    title: 'BCA / Computer Applications',
    stream: 'Science',
    description: 'Bachelor of Computer Applications is a 3-year degree focused on programming, software development, database management and networking. Great for students interested in IT without JEE.',
    duration: '3 Years',
    eligibility: 'Class 12 with Maths/Computer Science',
    careerScope: 'Software Developer, Web Developer, System Analyst, Database Administrator',
    entranceExam: 'Merit / University Entrance',
    universities: ['Delhi University', 'Symbiosis', 'Manipal University', 'Amity University']
  },
  {
    title: 'Pharmacy (B.Pharm)',
    stream: 'Science',
    description: 'Bachelor of Pharmacy covers pharmaceutical sciences, drug development, clinical pharmacy and pharmacology. Good option for PCB students besides MBBS.',
    duration: '4 Years',
    eligibility: 'Class 12 with PCB/PCM, min 45% marks',
    careerScope: 'Pharmacist, Drug Inspector, Medical Representative, Research Scientist',
    entranceExam: 'GPAT / State Pharmacy Entrance',
    universities: ['Jamia Hamdard', 'Manipal', 'JSS College of Pharmacy', 'BITS Pilani']
  },
  {
    title: 'Hotel Management (BHM)',
    stream: 'Arts',
    description: 'Bachelor of Hotel Management covers hospitality, food production, housekeeping, front office operations and tourism management.',
    duration: '3-4 Years',
    eligibility: 'Class 12 (any stream), min 50% marks',
    careerScope: 'Hotel Manager, Chef, Event Manager, Tourism Officer, Cabin Crew',
    entranceExam: 'NCHMCT JEE / IHM Entrance',
    universities: ['IHM Mumbai', 'IHM Delhi', 'Welcomgroup Graduate School', 'Christ University']
  },
  {
    title: 'Mass Communication / Journalism (BJMC)',
    stream: 'Arts',
    description: 'Bachelor of Journalism and Mass Communication covers print, digital, TV journalism, PR, advertising and media management.',
    duration: '3 Years',
    eligibility: 'Class 12 (any stream), min 45% marks',
    careerScope: 'Journalist, News Anchor, Content Writer, PR Manager, Social Media Manager',
    entranceExam: 'CUET / IPU CET / University Entrance',
    universities: ['Delhi University', 'Symbiosis', 'Manipal', 'IIMC New Delhi']
  },
  {
    title: 'Economics (BA/B.Sc)',
    stream: 'Commerce',
    description: 'Bachelor in Economics covers microeconomics, macroeconomics, statistics, econometrics and economic policy. Excellent base for civil services, MBA or research.',
    duration: '3 Years',
    eligibility: 'Class 12 with Commerce or Science',
    careerScope: 'Economist, Policy Analyst, Banking Officer, Civil Servant, Financial Analyst',
    entranceExam: 'CUET / University Entrance',
    universities: ['Delhi School of Economics', 'Presidency College', 'JNU', 'St. Stephens College']
  },
  {
    title: 'BBA + MBA Integrated',
    stream: 'Commerce',
    description: '5-year integrated program combining BBA and MBA. Saves a year compared to doing them separately. Focused on business, management, finance and entrepreneurship.',
    duration: '5 Years',
    eligibility: 'Class 12 (any stream), min 60% marks',
    careerScope: 'Business Manager, Consultant, Entrepreneur, Marketing Manager, Finance Manager',
    entranceExam: 'IPM (IIM Indore/Rohtak) / NPAT / SET',
    universities: ['IIM Indore', 'IIM Rohtak', 'IIM Jammu', 'Symbiosis']
  },
  {
    title: 'Animation & VFX',
    stream: 'Arts',
    description: 'Diploma/degree in Animation, VFX and Multimedia. Growing field with demand in film, gaming, advertising and education sectors.',
    duration: '3-4 Years',
    eligibility: 'Class 12 (any stream), creative interest',
    careerScope: 'Animator, VFX Artist, Game Designer, Motion Graphics Designer, Film Editor',
    entranceExam: 'FTII / NID DAT / Arena Entrance',
    universities: ['FTII Pune', 'NID', 'Arena Animation', 'Frameboxx', 'Pearl Academy']
  },
  {
    title: 'Social Work (BSW)',
    stream: 'Arts',
    description: 'Bachelor of Social Work focuses on community development, social welfare, counselling and NGO management. Ideal for students wanting to make a social impact.',
    duration: '3 Years',
    eligibility: 'Class 12 (any stream), min 45% marks',
    careerScope: 'Social Worker, NGO Manager, Counsellor, Community Developer, HR in NGOs',
    entranceExam: 'Merit / University Entrance',
    universities: ['Delhi University', 'TISS Mumbai', 'Jamia Millia', 'Indore School of Social Work']
  }
];

// Keep the pre-seeded medical degrees in their own filter category.
courses.find(course => course.title === 'MBBS / Medical').stream = 'Medical';
courses.find(course => course.title === 'Pharmacy (B.Pharm)').stream = 'Medical';
courses.push(...require('./additionalCourses'));

const solutions = [
  {
    class: 12,
    subject: 'Maths',
    chapter: 'Relations and Functions',
    chapterNo: 1,
    content: 'A relation R from a set A to a set B is a subset of the Cartesian product A x B. A function is a special type of relation where each input has exactly one output. Types of functions include: One-One (Injective) - every element of range is image of exactly one element of domain; Onto (Surjective) - every element of codomain is the image of some element of domain; Bijective - both one-one and onto. Composition of functions: (gof)(x) = g(f(x)). Inverse of a bijective function always exists.',
    keyPoints: [
      'Domain, Codomain and Range must be clearly identified',
      'A function is one-one if f(a) = f(b) implies a = b',
      'A function is onto if for every y in codomain, there exists x in domain such that f(x) = y',
      'Only bijective functions are invertible',
      'Composition of functions is not commutative but is associative'
    ],
    difficulty: 'Medium'
  },
  {
    class: 12,
    subject: 'Maths',
    chapter: 'Inverse Trigonometric Functions',
    chapterNo: 2,
    content: 'Inverse trigonometric functions are the inverse functions of trigonometric functions. Principal value of sin-1(x) lies in [-pi/2, pi/2]. Principal value of cos-1(x) lies in [0, pi]. Principal value of tan-1(x) lies in (-pi/2, pi/2). Key identities: sin-1(x) + cos-1(x) = pi/2 for x in [-1,1]. tan-1(x) + cot-1(x) = pi/2 for all x in R.',
    keyPoints: [
      'Always specify the principal value branch',
      'sin-1(sin x) = x only when x is in [-pi/2, pi/2]',
      'sin(sin-1 x) = x for x in [-1, 1]',
      'tan-1(x) + tan-1(y) = tan-1((x+y)/(1-xy)) when xy < 1',
      'Remember: domain of sin-1 is [-1, 1], range is [-pi/2, pi/2]'
    ],
    difficulty: 'Hard'
  },
  {
    class: 12,
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    chapterNo: 1,
    content: "Electric charge is a fundamental property of matter. Coulomb's Law: F = kq1q2/r^2 where k = 9x10^9 Nm^2/C^2. Electric field E = F/q0. Electric field due to point charge E = kq/r^2. Superposition principle: Net force on a charge is the vector sum of individual forces. Gauss's Law: Electric flux through a closed surface = Q_enclosed/epsilon_0. Electric field lines start from positive and end at negative charges.",
    keyPoints: [
      'Charge is conserved and quantized (q = ne)',
      'Like charges repel, unlike charges attract',
      'Electric field is a vector quantity',
      "Gauss's Law simplifies calculation for symmetric charge distributions",
      'SI unit of charge is Coulomb (C)'
    ],
    difficulty: 'Medium'
  },
  {
    class: 11,
    subject: 'Physics',
    chapter: 'Units and Measurements',
    chapterNo: 1,
    content: 'Measurement is the process of comparison of an unknown physical quantity with a standard quantity. The international system of units (SI) has 7 base units: meter (length), kilogram (mass), second (time), ampere (electric current), kelvin (temperature), mole (amount of substance), candela (luminous intensity). Dimensional analysis helps verify equations and convert units. Significant figures indicate precision of measurement.',
    keyPoints: [
      '7 fundamental quantities and their SI units must be memorized',
      'Dimensions of derived quantities can be expressed in base quantities',
      'Principle of homogeneity: dimensions on both sides of an equation must match',
      'Percentage error = (absolute error / mean value) x 100',
      'Significant figures: all non-zero digits and zeros between them are significant'
    ],
    difficulty: 'Easy'
  },
  {
    class: 12,
    subject: 'Chemistry',
    chapter: 'The Solid State',
    chapterNo: 1,
    content: 'Solids have definite shape, volume and rigid structure. Crystalline solids have orderly arrangement of particles (ionic, covalent, molecular, metallic). Amorphous solids lack long-range order. Crystal systems: cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, triclinic. Unit cells: simple cubic, BCC (body-centred), FCC (face-centred). Packing efficiency: SCC=52.4%, BCC=68%, FCC/HCP=74%.',
    keyPoints: [
      'Crystalline solids have sharp melting points; amorphous do not',
      'Bravais lattices: 14 types in 7 crystal systems',
      'FCC has 4 atoms per unit cell, BCC has 2, SCC has 1',
      'Voids in close packing: tetrahedral and octahedral',
      'Defects: Schottky (cation-anion pair missing) and Frenkel (ion displaced to interstitial site)'
    ],
    difficulty: 'Hard'
  },
  {
    class: 11,
    subject: 'Accountancy',
    chapter: 'Introduction to Accounting',
    chapterNo: 1,
    content: 'Accounting is an information system that identifies, measures, records and communicates financial information. Objectives: systematic recording, ascertaining profit/loss, knowing financial position, providing information to stakeholders. Basic accounting terms: Entity, Assets, Liabilities, Capital, Revenue, Expense, Debtors, Creditors, Transaction. Accounting equation: Assets = Liabilities + Capital. Double entry system: every transaction affects at least two accounts.',
    keyPoints: [
      'Accounting equation must always balance',
      'Assets include both tangible and intangible items',
      'Capital = Assets - Liabilities (owners equity)',
      'Revenue recognition: income is recorded when earned',
      'Double entry: every debit has a corresponding credit'
    ],
    difficulty: 'Easy'
  },
  {
    class: 11,
    subject: 'Maths',
    chapter: 'Sets',
    chapterNo: 1,
    content: 'A set is a well-defined collection of objects. Types: empty set, finite set, infinite set, equal sets, subsets, power set, universal set. Operations: Union (A∪B), Intersection (A∩B), Difference (A-B), Complement (A\'). De Morgan\'s Laws: (A∪B)\' = A\'∩B\' and (A∩B)\' = A\'∪B\'. Venn diagrams are used to represent sets visually. Number of subsets of a set with n elements = 2^n.',
    keyPoints: [
      'Every set is a subset of itself; empty set is subset of every set',
      'n(A∪B) = n(A) + n(B) - n(A∩B)',
      'Power set of a set with n elements has 2^n elements',
      'Complement of universal set is empty set',
      'A - B = A ∩ B\' (difference as intersection with complement)'
    ],
    difficulty: 'Easy'
  },
  {
    class: 11,
    subject: 'Maths',
    chapter: 'Trigonometric Functions',
    chapterNo: 3,
    content: 'Trigonometric functions are defined for angles in a right triangle and extended to all real numbers. sin²x + cos²x = 1, 1 + tan²x = sec²x, 1 + cot²x = cosec²x. Allied angles, compound angles: sin(A+B) = sinAcosB + cosAsinB. Multiple angle formulas: sin2A = 2sinAcosA, cos2A = cos²A - sin²A. General solutions: sinx = 0 → x = nπ, cosx = 0 → x = (2n+1)π/2.',
    keyPoints: [
      'ASTC rule: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4',
      'Period of sinx and cosx is 2π; period of tanx is π',
      'sin(−x) = −sinx (odd), cos(−x) = cosx (even)',
      'Product-to-sum and sum-to-product formulas are important for exams',
      'Always check domain when solving trigonometric equations'
    ],
    difficulty: 'Medium'
  },
  {
    class: 12,
    subject: 'Maths',
    chapter: 'Matrices',
    chapterNo: 3,
    content: 'A matrix is a rectangular array of numbers arranged in rows and columns. Types: row matrix, column matrix, square matrix, diagonal matrix, identity matrix, zero matrix, symmetric, skew-symmetric. Operations: addition, subtraction, scalar multiplication, matrix multiplication. AB ≠ BA in general. Transpose: (A\')\'= A, (AB)\' = B\'A\'. A square matrix A is symmetric if A\' = A and skew-symmetric if A\' = -A.',
    keyPoints: [
      'Matrix multiplication is defined only when columns of A = rows of B',
      'Identity matrix I satisfies AI = IA = A',
      'For symmetric matrix: a_ij = a_ji for all i, j',
      'Every square matrix can be expressed as sum of symmetric and skew-symmetric matrix',
      'Trace of matrix = sum of diagonal elements'
    ],
    difficulty: 'Medium'
  },
  {
    class: 12,
    subject: 'Physics',
    chapter: 'Current Electricity',
    chapterNo: 3,
    content: 'Electric current is the rate of flow of charge. I = Q/t. Ohm\'s Law: V = IR. Resistance R = ρL/A where ρ is resistivity. Series combination: R_total = R1+R2+R3. Parallel combination: 1/R_total = 1/R1 + 1/R2 + 1/R3. Kirchhoff\'s Laws: KCL (sum of currents at junction = 0), KVL (sum of EMFs = sum of IR drops in a loop). Wheatstone bridge: P/Q = R/S when balanced. Potentiometer measures EMF without drawing current.',
    keyPoints: [
      'Current flows from high potential to low potential (conventional)',
      'Resistivity increases with temperature for conductors',
      'Power P = VI = I²R = V²/R',
      'Internal resistance causes terminal voltage to be less than EMF',
      'Wheatstone bridge is used for accurate resistance measurement'
    ],
    difficulty: 'Medium'
  },
  {
    class: 12,
    subject: 'Biology',
    chapter: 'Reproduction in Organisms',
    chapterNo: 1,
    content: 'Reproduction is the process by which organisms produce offspring. Types: Asexual (single parent, genetically identical offspring) and Sexual (two parents, genetic variation). Asexual methods: binary fission (Amoeba), budding (Hydra, yeast), fragmentation (Spirogyra), regeneration, vegetative propagation. Sexual reproduction involves formation and fusion of gametes (fertilization). Life span varies: mayfly 1 day to banyan tree thousands of years.',
    keyPoints: [
      'Asexual reproduction produces clones (genetically identical)',
      'Sexual reproduction introduces genetic variation through meiosis',
      'Juvenile/vegetative phase precedes reproductive phase',
      'Oestrus cycle in non-primate mammals; menstrual cycle in primates',
      'External fertilization occurs in water; internal fertilization on land'
    ],
    difficulty: 'Easy'
  },
  {
    class: 11,
    subject: 'Chemistry',
    chapter: 'Some Basic Concepts of Chemistry',
    chapterNo: 1,
    content: 'Chemistry deals with matter, its properties and changes. Matter exists as solid, liquid and gas. Atoms and molecules are the basic units. Atomic mass is relative mass compared to 1/12th of C-12. Mole concept: 1 mole = 6.022×10²³ particles (Avogadro\'s number). Molar mass = mass of 1 mole in grams. Molarity = moles of solute / volume of solution in litres. Law of conservation of mass, law of constant proportions and law of multiple proportions are fundamental laws.',
    keyPoints: [
      '1 mole of any gas at STP occupies 22.4 litres',
      'Empirical formula shows simplest whole number ratio of atoms',
      'Molecular formula = n × empirical formula',
      'Limiting reagent determines maximum product in a reaction',
      '% yield = (actual yield / theoretical yield) × 100'
    ],
    difficulty: 'Easy'
  },
  {
    class: 12,
    subject: 'Economics',
    chapter: 'Introduction to Macroeconomics',
    chapterNo: 1,
    content: 'Macroeconomics studies the economy as a whole — national income, employment, inflation and economic growth. Key concepts: GDP (Gross Domestic Product) = total value of goods and services produced in a country in a year. GNP = GDP + Net Factor Income from Abroad. NNP = GNP - Depreciation. National Income at factor cost = NNP at market price - Net Indirect Taxes. Circular flow of income shows how money flows between households and firms.',
    keyPoints: [
      'GDP can be measured by Product, Income or Expenditure method',
      'Real GDP adjusts for inflation; Nominal GDP does not',
      'GDP does not measure inequality or well-being',
      'Depreciation = Capital Consumption Allowance',
      'Transfer payments (pension, scholarship) are NOT included in GDP'
    ],
    difficulty: 'Medium'
  }
];

solutions.push(...require('./additionalSolutions'));

const books = [
  {
    title: 'Mathematics Part I',
    subject: 'Maths',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lemh1=0-9',
    isAvailable: true
  },
  {
    title: 'Mathematics Part II',
    subject: 'Maths',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lemh2=0-7',
    isAvailable: true
  },
  {
    title: 'Physics Part I',
    subject: 'Physics',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?leph1=0-9',
    isAvailable: true
  },
  {
    title: 'Physics Part II',
    subject: 'Physics',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?leph2=0-8',
    isAvailable: true
  },
  {
    title: 'Chemistry Part I',
    subject: 'Chemistry',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lech1=0-9',
    isAvailable: true
  },
  {
    title: 'Chemistry Part II',
    subject: 'Chemistry',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lech2=0-7',
    isAvailable: true
  },
  {
    title: 'Biology',
    subject: 'Biology',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lebo1=0-16',
    isAvailable: true
  },
  {
    title: 'Mathematics',
    subject: 'Maths',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kemh1=0-16',
    isAvailable: true
  },
  {
    title: 'Physics Part I',
    subject: 'Physics',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?keph1=0-8',
    isAvailable: true
  },
  {
    title: 'Accountancy I — Not-for-Profit Organisation and Partnership Accounts',
    subject: 'Accountancy',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?laco1=0-9',
    isAvailable: true
  },
  {
    title: 'Business Studies',
    subject: 'Business Studies',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lbst1=0-12',
    isAvailable: true
  },
  {
    title: 'Economics',
    subject: 'Economics',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?leec1=0-10',
    isAvailable: true
  },
  {
    title: 'Biology',
    subject: 'Biology',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kebo1=0-22',
    isAvailable: true
  },
  {
    title: 'Chemistry Part I',
    subject: 'Chemistry',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kech1=0-14',
    isAvailable: true
  },
  {
    title: 'Chemistry Part II',
    subject: 'Chemistry',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kech2=0-10',
    isAvailable: true
  },
  {
    title: 'Physics Part II',
    subject: 'Physics',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?keph2=0-9',
    isAvailable: true
  },
  {
    title: 'Accountancy II — Company Accounts and Analysis',
    subject: 'Accountancy',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?laco2=0-9',
    isAvailable: true
  },
  {
    title: 'Accountancy — Financial Accounting Part I',
    subject: 'Accountancy',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kaco1=0-9',
    isAvailable: true
  },
  {
    title: 'Accountancy — Financial Accounting Part II',
    subject: 'Accountancy',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kaco2=0-5',
    isAvailable: true
  },
  {
    title: 'Business Studies Part I',
    subject: 'Business Studies',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kbst1=0-11',
    isAvailable: true
  },
  {
    title: 'Economics — Indian Economic Development',
    subject: 'Economics',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?keie1=0-10',
    isAvailable: true
  },
  {
    title: 'Economics — Statistics for Economics',
    subject: 'Economics',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kest1=0-9',
    isAvailable: true
  },
  {
    title: 'English — Flamingo',
    subject: 'English',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?lefl1=0-8',
    isAvailable: true
  },
  {
    title: 'English — Vistas (Supplementary)',
    subject: 'English',
    class: 12,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?levs1=0-8',
    isAvailable: true
  },
  {
    title: 'History — Themes in World History',
    subject: 'History',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?khis1=0-9',
    isAvailable: true
  },
  {
    title: 'Political Science — Political Theory',
    subject: 'Political Science',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kpol1=0-10',
    isAvailable: true
  },
  {
    title: 'Psychology',
    subject: 'Psychology',
    class: 11,
    board: 'CBSE',
    author: 'NCERT',
    publisher: 'NCERT',
    ncertLink: 'https://ncert.nic.in/textbook.php?kpsy1=0-9',
    isAvailable: true
  }
];

books.push(...require('./additionalBooks'));

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    await Solution.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    await Course.insertMany(courses);
    console.log(`Inserted ${courses.length} courses`);

    await Solution.insertMany(solutions);
    console.log(`Inserted ${solutions.length} solutions`);

    await Book.insertMany(books);
    console.log(`Inserted ${books.length} books`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
