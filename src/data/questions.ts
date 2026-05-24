import { Question } from '../types';

export const sampleQuestions: Question[] = [
  // --- UNT ---
  {
    id: 'unt_1',
    exam: 'UNT',
    subject: 'History of Kazakhstan',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Altyn Orda (Golden Horde)',
    text: 'According to NTC 2025–26 official curriculum, in which year did Almalyk become the recognized center of the Chagatay Ulus?',
    options: [
      '1269 (Talas Kurultai)',
      '1310 (Reorganization under Esen Buga)',
      '1321 (Division into Transoxiana and Mogulistan)',
      '1346 (Reign of Kazan Khan)'
    ],
    correctIndex: 1
  },
  {
    id: 'unt_2',
    exam: 'UNT',
    subject: 'Mathematical Literacy',
    year: '2026',
    difficulty: 'Easy',
    topic: 'Venn Diagrams & Sets',
    text: 'In a class of 25 students, 15 study Kazakh, 12 study English, and 5 study both language programs. How many students do not study either subject?',
    options: [
      '1 student',
      '3 students',
      '5 students',
      '8 students'
    ],
    correctIndex: 1 // 25 - (15 + 12 - 5) = 25 - 22 = 3
  },
  {
    id: 'unt_3',
    exam: 'UNT',
    subject: 'Physics',
    year: '2025',
    difficulty: 'Advanced',
    topic: 'Quantum Physics',
    text: 'Determine the energy of a photon with a frequency of 5 × 10¹⁴ Hz. (Use Planck\'s constant h ≈ 6.63 × 10⁻³⁴ J·s).',
    options: [
      '3.32 × 10⁻¹⁹ Joules',
      '1.32 × 10⁻¹⁹ Joules',
      '6.63 × 10⁻¹⁹ Joules',
      '9.95 × 10⁻¹⁹ Joules'
    ],
    correctIndex: 0 // h * f => 6.63e-34 * 5e14 = 3.315e-19
  },

  // --- AP ---
  {
    id: 'ap_1',
    exam: 'AP',
    subject: 'Calculus BC',
    year: '2025',
    difficulty: 'Advanced',
    topic: 'Taylor Series Expansion',
    text: 'Find the coefficient of the x³ term in the Taylor series expansion of f(x) = e^(2x) about x = 0.',
    options: [
      '1/3',
      '4/3',
      '2/3',
      '8/3'
    ],
    correctIndex: 1 // e^(2x) = Sum (2x)^n/n! => for n=3: 8x^3/6 = 4/3 x^3
  },
  {
    id: 'ap_2',
    exam: 'AP',
    subject: 'Computer Science A',
    year: '2026',
    difficulty: 'Intermediate',
    topic: 'Recursion Trace',
    text: 'Consider the following recursive method:\n\npublic int fun(int n) {\n  if (n <= 1) return 1;\n  return fun(n - 1) + fun(n - 2);\n}\n\nWhat is the value returned by the method call fun(5)?',
    options: [
      '5',
      '8',
      '13',
      '21'
    ],
    correctIndex: 1 // Fibonacci sequence: fun(1)=1, fun(2)=2, fun(3)=3, fun(4)=5, fun(5)=8
  },
  {
    id: 'ap_3',
    exam: 'AP',
    subject: 'Physics C: Electromagnetism',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Faraday\'s Law',
    text: 'A flat circular loop of wire with an area of 0.1 m² is placed perpendicular to a magnetic field that increases uniformly from 0.5 Tesla to 1.5 Tesla in a span of 0.2 seconds. What is the magnitude of the induced electromotive force (EMF) in the loop?',
    options: [
      '0.1 Volts',
      '0.5 Volts',
      '1.0 Volts',
      '2.0 Volts'
    ],
    correctIndex: 1 // e = A * db/dt = 0.1 * 1.0 / 0.2 = 0.5 V
  },

  // --- IELTS ---
  {
    id: 'ielts_1',
    exam: 'IELTS',
    subject: 'Academic Reading',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Avian Navigation Studies',
    passage: 'A recent trial conducted by biology researchers at the Cambridge Science Institute (2025) indicates that migrating avian species utilize highly localized visual markers to calibrate their internal magnetoreception. When biological filters are applied that disrupt magnetic fields, the birds exhibit brief disorientation but soon recalibrate using high-contrast landmarks like mountain profiles or coastlines.',
    text: 'Based on the passage details, what main mechanism do avian species use to recover their navigational course when magnetic sensitivity is blocked?',
    options: [
      'They depend on sound waves emitted by major wind currents.',
      'They rely on high-contrast landmark features to calibrate orientation.',
      'They emit ultrasonic pings that echo off visual obstacles.',
      'They temporarily stall flight patterns until the magnetic storms pass.'
    ],
    correctIndex: 1
  },
  {
    id: 'ielts_2',
    exam: 'IELTS',
    subject: 'Academic Reading',
    year: '2026',
    difficulty: 'Easy',
    topic: 'Global Grid Transitions',
    passage: 'By mid-2025, modern smart-grid energy platforms surpassed antique coal-fired utilities in combined active generation storage across three major continents, marking historical steps towards climate neutrality. However, coal remains the primary base load resource for nighttime operations in four high-demand manufacturing territories.',
    text: 'True, False, or Not Given: Global coal consumption dropped to absolute zero during nighttime peak periods.',
    options: [
      'True',
      'False',
      'Not Given'
    ],
    correctIndex: 1 // "coal remains the primary base load resource for nighttime operations", hence False
  },

  // --- SAT ---
  {
    id: 'sat_1',
    exam: 'SAT',
    subject: 'Evidence-Based Reading & Writing',
    year: '2026',
    difficulty: 'Advanced',
    topic: 'Words in Context',
    passage: 'As natural history curators attempt to exhibit organic sculptures made of living lichens, they understand that these biological assets will naturally decay over time. Curators are thus placed in the ______ position of whether to replace decaying specimens with synthetic duplicates (thus breaking the biological premise) or allow the artwork to gradually fade from view.',
    text: 'Which choice most logically completes the blank in the context of the sentence?',
    options: [
      'precarious (unstable or difficult)',
      'enviable (highly desirable)',
      'unambiguous (completely clear)',
      'superfluous (unnecessary/redundant)'
    ],
    correctIndex: 0
  },
  {
    id: 'sat_2',
    exam: 'SAT',
    subject: 'Math',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Quadratic Equations',
    text: 'For what value of the constant k does the quadratic equation f(x) = x² - 4x + k have exactly one distinct real root?',
    options: [
      '0',
      '2',
      '4',
      '8'
    ],
    correctIndex: 2 // discriminant D = 16 - 4k => D=0 => k=4
  },

  // --- IB ---
  {
    id: 'ib_1',
    exam: 'IB',
    subject: 'Biology HL',
    year: '2025',
    difficulty: 'Easy',
    topic: 'Mendelian Genetics',
    text: 'In a classical dihybrid cross of two heterozygous garden pea plants (RrYy × RrYy), what is the calculated fraction of offspring that are expected to be homozygous recessive for both traits (rryy)?',
    options: [
      '1/16',
      '3/16',
      '9/16',
      '1/4'
    ],
    correctIndex: 0
  },
  {
    id: 'ib_2',
    exam: 'IB',
    subject: 'Physics HL',
    year: '2025',
    difficulty: 'Intermediate',
    topic: 'Ideal Gases',
    text: 'An ideal gas is enclosed in a rigid container with volume V and pressure P. If the temperature of the gas is maintained constant while the total volume is reduced to exactly V/4, what is the new pressure exerted by the gas?',
    options: [
      'P/4',
      'P',
      '2P',
      '4P'
    ],
    correctIndex: 3 // Boyle's law: P1*V1 = P2*V2 => P*V = P2 * V/4 => P2 = 4P
  }
];
