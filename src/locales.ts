import { LanguageCode } from './types';

export interface Localization {
  appTitle: string;
  appSubtitle: string;
  chooseLanguage: string;
  loginText: string;
  enterName: string;
  startPractice: string;
  guestUser: string;
  selectExam: string;
  examDescription: string;
  practiceSettings: string;
  selectSubject: string;
  selectDifficulty: string;
  difficultyAll: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  topicText: string;
  questionNumber: string;
  ofText: string;
  passageText: string;
  submitAnswer: string;
  nextQuestion: string;
  completedTitle: string;
  completedText: string;
  correctCountText: string;
  accuracyText: string;
  retryText: string;
  explainWithGemini: string;
  explainingLoading: string;
  correctAnswerText: string;
  whyWrongText: string;
  conceptExplainedText: string;
  workedExampleText: string;
  tipToRememberText: string;
  aiChatTitle: string;
  aiChatPlaceholder: string;
  sendText: string;
  aiChatHelpInitial: string;
  dashboardTitle: string;
  dashboardStats: string;
  statsSolved: string;
  statsAccuracy: string;
  statsTimeSpent: string;
  statsStreak: string;
  weakTopicsTitle: string;
  recommendationsTitle: string;
  noStatsYet: string;
  historyTitle: string;
  headerSettings: string;
  scoreCard: string;
  noWeakTopicsYet: string;
  noRecommendationsYet: string;
  allSubjects: string;
  minutesLabel: string;
  daysLabel: string;
  chatQuickExplainCalc: string;
  chatQuickIeltsWriting: string;
  chatQuickGivePractice: string;
  verifyAnswer: string;
}

export const locales: Record<LanguageCode, Localization> = {
  en: {
    appTitle: "Akeser Prep",
    appSubtitle: "AI-Powered Multilingual Training Platform 2025–2026",
    chooseLanguage: "Practice Language",
    loginText: "Welcome to Akeser Prep",
    enterName: "Enter your name to start:",
    startPractice: "Start Practicing",
    guestUser: "Student",
    selectExam: "Choose Exam Environment",
    examDescription: "Each module strictly simulates standard syllabus materials and structure for 2025–2026.",
    practiceSettings: "Practice Configuration",
    selectSubject: "Choose Subject",
    selectDifficulty: "Select Difficulty",
    difficultyAll: "All Levels",
    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    topicText: "Topic",
    questionNumber: "Question",
    ofText: "of",
    passageText: "Reference Passage",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Question",
    completedTitle: "Session Complete!",
    completedText: "You have reviewed all standard sample items in this category.",
    correctCountText: "Correct Choices",
    accuracyText: "Practice Accuracy",
    retryText: "Restart Set",
    explainWithGemini: "Analyze Mistake with Gemini",
    explainingLoading: "Gemini is generating interactive step-by-step breakdown...",
    correctAnswerText: "Correct Answer",
    whyWrongText: "Why Your Response Was Incorrect",
    conceptExplainedText: "Key Concept Explained",
    workedExampleText: "Similar Worked Example",
    tipToRememberText: "Tip to Remember",
    aiChatTitle: "AI Study Mentor",
    aiChatPlaceholder: "Ask me to explain any concept or provide a practice problem...",
    sendText: "Send",
    aiChatHelpInitial: "Hello! I am your AI study companion. Need help understanding tenses, limits, or historical events? Go ahead and ask me anything!",
    dashboardTitle: "Knowledge Dashboard",
    dashboardStats: "Performance Analytics",
    statsSolved: "Solved Items",
    statsAccuracy: "Avg accuracy",
    statsTimeSpent: "Practice Time",
    statsStreak: "Current Streak",
    weakTopicsTitle: "Weakness Identification",
    recommendationsTitle: "AI Recommended Topics",
    noStatsYet: "No practice records exist yet. Start solving questions to populate analytics!",
    historyTitle: "Practice Log",
    headerSettings: "Settings",
    scoreCard: "Completed Score Details",
    noWeakTopicsYet: "No weak areas flagged. Excellent performance!",
    noRecommendationsYet: "You are doing great! Continue practicing from all sections.",
    allSubjects: "All Subjects",
    minutesLabel: "min",
    daysLabel: "days",
    chatQuickExplainCalc: "Explain Calculus derivative limit rule",
    chatQuickIeltsWriting: "Difference of tenses in IELTS task 2",
    chatQuickGivePractice: "Give me an IB style practice problem",
    verifyAnswer: "Verify My Response"
  },
  kk: {
    appTitle: "Akeser Prep",
    appSubtitle: "Интеллектуалды көптілді емтиханға дайындық платформасы 2025–2026",
    chooseLanguage: "Тәжірибе тілі",
    loginText: "Akeser Prep платформасына қош келдіңіз",
    enterName: "Бастау үшін есіміңізді енгізіңіз:",
    startPractice: "Тәжірибені бастау",
    guestUser: "Оқушы",
    selectExam: "Емтихан бағытын таңдаңыз",
    examDescription: "Әрбір модуль 2025–2026 оқу жоспарының бағдарламалары мен құрылымын толық қамтиды.",
    practiceSettings: "Баптау параметрлері",
    selectSubject: "Пәнді таңдаңыз",
    selectDifficulty: "Қиындық деңгейін таңдаңыз",
    difficultyAll: "Барлық деңгейлер",
    difficultyEasy: "Оңай",
    difficultyMedium: "Орташа",
    difficultyHard: "Қиын",
    topicText: "Тақырыбы",
    questionNumber: "Сұрақ",
    ofText: "ішінен",
    passageText: "Сілтеме мәтіні",
    submitAnswer: "Жауапты тапсыру",
    nextQuestion: "Келесі сұрақ",
    completedTitle: "Жаттығу аяқталды!",
    completedText: "Сіз осы санаттағы барлық стандартты сұрақтарды аяқтадыңыз.",
    correctCountText: "Дұрыс жауаптар",
    accuracyText: "Жаттығу дәлдігі",
    retryText: "Қайта бастау",
    explainWithGemini: "Gemini-мен қатені талдау",
    explainingLoading: "Gemini сіз үшін интерактивті түсіндірмені генерациялауда...",
    correctAnswerText: "Дұрыс жауап",
    whyWrongText: "Сіздің жауабыңыздың қате болу себебі",
    conceptExplainedText: "Негізгі ереже/тұжырымдама",
    workedExampleText: "Ұқсас мысал жұмысы",
    tipToRememberText: "Есте сақтауға кеңес",
    aiChatTitle: "AI Оқу Менторы",
    aiChatPlaceholder: "Кез келген ережені түсіндіруді немесе есеп беруді сұраңыз...",
    sendText: "Жіберу",
    aiChatHelpInitial: "Сәлеметсіз бе! Мен сіздің виртуалды көмекшіңізбін. Логикалық шектеулерді немесе грамматикалық қиындықтарды түсіндіру керек пе? Кез келген сұрақ қойыңыз!",
    dashboardTitle: "Білім аналитикасы",
    dashboardStats: "Көрсеткіштер статистикасы",
    statsSolved: "Шешілген тапсырмалар",
    statsAccuracy: "Орташа дәлдік",
    statsTimeSpent: "Жаттығу уақыты",
    statsStreak: "Күнделікті белсенділік",
    weakTopicsTitle: "Әлсіз тақырыптарды анықтау",
    recommendationsTitle: "AI ұсынған жаттығу бағыттары",
    noStatsYet: "Қазірше статистика жоқ. Аналитиканы толтыру үшін сұрақтарды шешуді бастаңыз!",
    historyTitle: "Тәжірибе тарихы",
    headerSettings: "Параметрлер",
    scoreCard: "Аяқталған жаттығу нәтижесі",
    noWeakTopicsYet: "Әлсіз тақырыптар жоқ. Керемет көрсеткіш!",
    noRecommendationsYet: "Бәрі тамаша! Барлық санаттардан жаттығуды жалғастырыңыз.",
    allSubjects: "Барлық пәндер",
    minutesLabel: "мин",
    daysLabel: "күн",
    chatQuickExplainCalc: "Туындының шектеу ережесін түсіндіру",
    chatQuickIeltsWriting: "IELTS Task 2-дегі шақтардың айырмашылығы",
    chatQuickGivePractice: "Маған IB үлгісіндегі тапсырма берші",
    verifyAnswer: "Жауабымды тексеру"
  },
  uz: {
    appTitle: "Akeser Prep",
    appSubtitle: "Intellektual ko'ptilli imtihonga tayyorlanish platformasi 2025–2026",
    chooseLanguage: "Amaliyot tili",
    loginText: "Akeser Prep portaliga xush kelibsiz",
    enterName: "Boshlash uchun ismingizni kiriting:",
    startPractice: "Amaliyotni boshlash",
    guestUser: "Talaba",
    selectExam: "Imtihon yo'nalishini tanlang",
    examDescription: "Har bir modul 2025–2026 yilgi o'quv dasturlari va savol tuzilishlarini to'liq qamrab oladi.",
    practiceSettings: "Amaliyot sozlamalari",
    selectSubject: "Fanni tanlang",
    selectDifficulty: "Qiyinchilik darajasi",
    difficultyAll: "Barcha darajalar",
    difficultyEasy: "Oson",
    difficultyMedium: "O'rtacha",
    difficultyHard: "Qiyin",
    topicText: "Mavzu",
    questionNumber: "Savol",
    ofText: "dan",
    passageText: "Malumot matni",
    submitAnswer: "Javobni yuborish",
    nextQuestion: "Keyingi savol",
    completedTitle: "Mashg'ulot yakunlandi!",
    completedText: "Siz ushbu bo'limdagi barcha standart savollarni yakunladingiz.",
    correctCountText: "To'g'ri javoblar",
    accuracyText: "Amaliyot aniqligi",
    retryText: "Qayta boshlash",
    explainWithGemini: "Gemini orqali xatoni tahlil qilish",
    explainingLoading: "Gemini siz uchun batafsil tushuntirish tayyorlamoqda...",
    correctAnswerText: "To'g'ri javob",
    whyWrongText: "Sizning tanlovingiz nima sababdan xato bo'lganligi",
    conceptExplainedText: "Asosiy tushuncha / Qoida",
    workedExampleText: "O'xshash misol tahlili",
    tipToRememberText: "Yodda saqlash uchun tavsiya",
    aiChatTitle: "AI Ta'lim Maslahatchisi",
    aiChatPlaceholder: "Mendan har qanday qoidani tushuntirishni so'rang...",
    sendText: "Yuborish",
    aiChatHelpInitial: "Salom! Men sizning sun'iy intellektli maslahatchiman. IELTS Writing, Matematika limitlari yoki tarixiy hodisalarni tushunishda yordam kerakmi? Bemalol so'rang!",
    dashboardTitle: "Bilim Tahlili",
    dashboardStats: "Amaliyot natijalari",
    statsSolved: "Yechilgan savollar",
    statsAccuracy: "O'rtacha aniqlik",
    statsTimeSpent: "Sarf qilingan vaqt",
    statsStreak: "Kundalik faollik",
    weakTopicsTitle: "Zaif mavzularni aniqlash",
    recommendationsTitle: "AI tomonidan tavsiya etilgan mavzular",
    noStatsYet: "Hozircha statistika mavjud emas. Ma'lumotlarni shakllantirish uchun amaliyotni boshlang!",
    historyTitle: "Amaliyot jurnali",
    headerSettings: "Sozlamalar",
    scoreCard: "Mashg'ulot natijalari tahlili",
    noWeakTopicsYet: "Zaif mavzular mavjud emas. Ajoyib natija!",
    noRecommendationsYet: "Hammasi ajoyib! Barcha bo'limlardan amaliyotni davom ettiring.",
    allSubjects: "Barcha fanlar",
    minutesLabel: "daqiqa",
    daysLabel: "kun",
    chatQuickExplainCalc: "Calculus hosila olish qoidasini tushuntir",
    chatQuickIeltsWriting: "IELTS task 2-da zamonlar farqi",
    chatQuickGivePractice: "Menga IB uslubida savol ber",
    verifyAnswer: "Javobimni tekshir"
  },
  ky: {
    appTitle: "Akeser Prep",
    appSubtitle: "Интеллектуалдуу көп тилдүү сынак даярдоо платформасы 2025–2026",
    chooseLanguage: "Көнүгүү тили",
    loginText: "Akeser Prep порталына кош келиңиз",
    enterName: "Баштоо үчүн атыңызды жазыңыз:",
    startPractice: "Көнүгүүнү баштоо",
    guestUser: "Окуучу",
    selectExam: "Сынак багытын тандаңыз",
    examDescription: "Ар бир модуль 2025–2026-жылдагы окуу пландарынын негизинде иштелип чыккан.",
    practiceSettings: "Конфигурация баптамалары",
    selectSubject: "Предметти тандаңыз",
    selectDifficulty: "Кыйынчылык деңгээли",
    difficultyAll: "Бардык деңгээлдер",
    difficultyEasy: "Оңой",
    difficultyMedium: "Орточо",
    difficultyHard: "Кыйын",
    topicText: "Темасы",
    questionNumber: "Суроо",
    ofText: "ичинен",
    passageText: "Маалымдама мәтін",
    submitAnswer: "Жоопту жөнөтүү",
    nextQuestion: "Кийинки суроо",
    completedTitle: "Машыгуу аяктады!",
    completedText: "Сиз бул бөлүмдөгү бардык типтүү суроолорду чечтиңиз.",
    correctCountText: "Туура жооптор",
    accuracyText: "Көнүгүү тактыгы",
    retryText: "Кайра баштоо",
    explainWithGemini: "Gemini менен катаны талдоо",
    explainingLoading: "Gemini сиз үчүн мазмундуу түшүндүрмө даярдап жатат...",
    correctAnswerText: "Туура жооп",
    whyWrongText: "Жообуңуз эмне үчүн туура эмес болгондугу",
    conceptExplainedText: "Негизги тема / Эреже",
    workedExampleText: "Окшош талданган мисал",
    tipToRememberText: "Эстеп калуу тартиби",
    aiChatTitle: "AI Окуу Көмөкчүсү",
    aiChatPlaceholder: "Түшүнбөгөн эрежени же формулаларды сураңыз...",
    sendText: "Жөнөтүү",
    aiChatHelpInitial: "Салам! Мен сиздин сынакка даярдануудагы AI жардамчыңызмын. Математикалык теорияларды, грамматиканы түшүнбөй жатсаңыз, суроолоруңузду бериңиз!",
    dashboardTitle: "Жетишкендик аналитикасы",
    dashboardStats: "Машыгуунун жыйынтыктары",
    statsSolved: "Чечилген тапшырмалар",
    statsAccuracy: "Орточо тактык",
    statsTimeSpent: "Көнүгүү убактысы",
    statsStreak: "Күнүмдүк катышуу",
    weakTopicsTitle: "Ката кеткен темаларды талдоо",
    recommendationsTitle: "AI сунуштаган темалар",
    noStatsYet: "Азырынча статистика жок. Көрсөткүчтөрдү жаратуу үчүн машыгууну баштаңыз!",
    historyTitle: "Тәжірибе журналы",
    headerSettings: "Баптоолор",
    scoreCard: "Машыгуу көрсөткүчтөрүнүн жыйынтыгы",
    noWeakTopicsYet: "Ката кеткен алсыз темалар аныктала элек. Абдан жакшы!",
    noRecommendationsYet: "Баары эң сонун! Бардык бөлүмдөрдөн машыгууну улантыңыз.",
    allSubjects: "Бардык предметтер",
    minutesLabel: "мүн",
    daysLabel: "күн",
    chatQuickExplainCalc: "Туундунун чексиздик эрежесин түшүндүрүү",
    chatQuickIeltsWriting: "IELTS Task 2-де убакыт формаларынын айырмасы",
    chatQuickGivePractice: "Мага IB форматындагы суроо бер",
    verifyAnswer: "Жообумду текшер"
  }
};
