/**
 * @file mr.js
 * @description Complete Marathi translation dictionary for Little Explorers.
 * @module i18n/mr
 */

/** @type {Object} */
const mr = {
  // ── App-Level ───────────────────────────────────────────────────────────
  app: {
    appName: 'लिटल एक्सप्लोरर्स',
    welcome: 'स्वागत आहे, {name}!',
    loading: 'लोड होत आहे…',
    error: 'काहीतरी चूक झाली.',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    back: 'मागे',
    next: 'पुढे',
    previous: 'मागील',
    close: 'बंद करा',
    confirm: 'नक्की करा',
    search: 'शोधा',
    filter: 'फिल्टर करा',
    preview: 'पूर्वावलोकन',
    publish: 'प्रकाशित करा',
    draft: 'मसुदा',
    yes: 'होय',
    no: 'नाही',
    ok: 'ठीक आहे',
    retry: 'पुन्हा प्रयत्न करा',
    done: 'पूर्ण झाले',
    start: 'सुरू करा',
    stop: 'थांबवा',
    play: 'खेळा',
    pause: 'विराम द्या',
    resume: 'सुरू ठेवा',
    reset: 'पूर्ववत करा',
    submit: 'सादर करा',
  },

  // ── Navigation ──────────────────────────────────────────────────────────
  nav: {
    home: 'मुख्यपृष्ठ',
    myWorlds: 'माझी शिकण्याची जगते',
    myActivities: 'माझे उपक्रम',
    myAchievements: 'माझे यश',
    parentArea: 'पालक कक्ष',
    settings: 'सेटिंग्ज',
    logout: 'बाहेर पडा',
    backToWorlds: 'जगाकडे परत',
    backToHome: 'मुख्यपृष्ठावर परत',
    backToDashboard: 'डॅशबोर्डवर परत',
  },

  // ── Learning Worlds ─────────────────────────────────────────────────────
  worlds: {
    letterLand: {
      name: 'अक्षर नगरी',
      description: 'अक्षरे, आवाज आणि शब्द शोधा!',
      greeting: 'अक्षर नगरीमध्ये आपले स्वागत आहे! चला आज अक्षरे वाचूया!',
    },
    numberTown: {
      name: 'अंक नगर',
      description: 'मोजा, जुळवा आणि संख्यांशी खेळा!',
      greeting: 'अंक नगरात आपले स्वागत आहे! एकत्र संख्या शोधूया!',
    },
    shapeGarden: {
      name: 'आकार बाग',
      description: 'आपल्या सभोवतालचे आकार आणि नमुने एक्सप्लोर करा!',
      greeting: 'आकार बागेत या! किती सुंदर आकार आहेत पहा!',
    },
    animalWorld: {
      name: 'प्राणी विश्व',
      description: 'प्राणी, पक्षी आणि निसर्गाबद्दल जाणून घ्या!',
      greeting: 'प्राणी विश्वात स्वागत आहे! प्राण्यांचे आवाज ऐका!',
    },
    puzzlePlanet: {
      name: 'कोडे ग्रह',
      description: 'मजेदार कोडी सोडवा आणि मेंदू चालवा!',
      greeting: 'कोडे ग्रहावर आपले स्वागत आहे! चला कोडी सोडवूया!',
    },
    feelingsFriends: {
      name: 'भावना आणि मित्र',
      description: 'भावना, वाटून घेणे आणि दयाळूपणा समजून घ्या!',
      greeting: 'भावना आणि मित्रांच्या जगात स्वागत आहे! आपण एकत्र खेळूया!',
    },
  },

  // ── Learning Domains ────────────────────────────────────────────────────
  domains: {
    literacy: {
      name: 'भाषा आणि साक्षरता',
      description: 'अक्षरे ओळखणे, ध्वनी आणि शब्दसंग्रह.',
    },
    numeracy: {
      name: 'गणित आणि मोजणी',
      description: 'संख्या ओळख, मोजणी आणि क्रम.',
    },
    spatial: {
      name: 'आकार आणि नमुने',
      description: 'आकार ओळख, तुलना आणि नमुने.',
    },
    nature: {
      name: 'पर्यावरण आणि निसर्ग',
      description: 'प्राणी, वनस्पती आणि आपल्या सभोवतालचे जग.',
    },
    social: {
      name: 'सामाजिक-भावनिक विकास',
      description: 'भावना, मैत्री आणि सहकार्य.',
    },
    cognitive: {
      name: 'तार्किक विचार आणि समस्या निवारण',
      description: 'जुळवणी, वर्गीकरण आणि कोडी.',
    },
  },

  // ── Activity Types ──────────────────────────────────────────────────────
  activityTypes: {
    'tap-select': {
      name: 'टॅप करा आणि निवडा',
      description: 'पर्यायांमधून योग्य उत्तर टॅप करा.',
    },
    'listen-choose': {
      name: 'ऐका आणि निवडा',
      description: 'आवाज ऐका आणि योग्य चित्र निवडा.',
    },
    'drag-drop': {
      name: 'ओढा आणि ठेवा',
      description: 'वस्तू त्यांच्या योग्य जागी ओढा.',
    },
    'matching-pairs': {
      name: 'जोड्या जुळवा',
      description: 'संबंधित चित्रे किंवा वस्तू एकमेकांशी जोडा.',
    },
    'count-collect': {
      name: 'मोजा आणि गोळा करा',
      description: 'आवश्यक तितक्या वस्तू मोजून गोळा करा.',
    },
    'sorting': {
      name: 'वर्गीकरण खेळ',
      description: 'वस्तू त्यांच्या योग्य गटात वर्गीकरण करा.',
    },
    'patterns': {
      name: 'नमुना पूर्ण करा',
      description: 'नमुन्यातील गहाळ वस्तू ओळखा आणि पूर्ण करा.',
    },
    'number-sequence': {
      name: 'संख्या क्रम',
      description: 'संख्या योग्य क्रमाने लावा.',
    },
    'picture-sequence': {
      name: 'चित्र क्रम',
      description: 'चित्रे योग्य क्रमाने लावा.',
    },
    'find-difference': {
      name: 'फरक ओळखा',
      description: 'दोन चित्रांमधील फरक शोधा.',
    },
    'memory-match': {
      name: 'स्मृती जुळवणी',
      description: 'कार्ड्स उलटे करून जुळणाऱ्या जोड्या शोधा.',
    },
    'shadow-matching': {
      name: 'सावली जुळवा',
      description: 'वस्तूंना त्यांच्या योग्य सावलीशी जुळवा.',
    },
    'missing-piece': {
      name: 'गहाळ तुकडा कोडे',
      description: 'चित्राचा गहाळ तुकडा निवडून चित्र पूर्ण करा.',
    },
    'picture-puzzle': {
      name: 'चित्र कोडे',
      description: 'तुकडे एकत्र करून संपूर्ण चित्र बनवा.',
    },
    'story-response': {
      name: 'गोष्ट आणि प्रतिसाद',
      description: 'गोष्ट ऐका आणि साध्या प्रश्नांची उत्तरे द्या.',
    },
    'trace-draw': {
      name: 'ट्रेस करा आणि काढा',
      description: 'रेषा, आकार किंवा अक्षरे गिरवा.',
    },
    'colour-create': {
      name: 'रंगवा आणि तयार करा',
      description: 'चित्रांमध्ये आवडीचे रंग भरा.',
    },
    'explore-discover': {
      name: 'शोधा आणि निरीक्षण करा',
      description: 'चित्रातील गोष्टी एक्सप्लोर करा आणि शोधा.',
    },
  },

  // ── Question Builder ────────────────────────────────────────────────────
  questionBuilder: {
    steps: {
      group: 'वयोगट निवडा',
      domain: 'शिकण्याचे क्षेत्र निवडा',
      objective: 'उद्दिष्ट निवडा',
      activityType: 'उपक्रम प्रकार',
      content: 'सामग्री तयार करा',
      languages: 'भाषा जोडा',
      media: 'माध्यमे जोडा',
      hints: 'मदत आणि प्रतिसाद',
      preview: 'पूर्वावलोकन',
      save: 'जतन आणि प्रकाशित',
    },
    labels: {
      title: 'शीर्षक',
      instruction: 'सूचना',
      hint1: 'पहिली मदत',
      hint2: 'दुसरी मदत',
      successMsg: 'यशाचा संदेश',
      retryMsg: 'प्रोत्साहन संदेश',
      ageGroup: 'वयोगट',
      domain: 'शिकण्याचे क्षेत्र',
      objective: 'शिकण्याचे उद्दिष्ट',
      customObjective: 'पालक-परिभाषित उद्दिष्ट',
      activityType: 'उपक्रम प्रकार',
      options: 'पर्याय',
      correctAnswer: 'बरोबर उत्तर',
      uploadImage: 'चित्र अपलोड करा',
      uploadAudio: 'ऑडिओ अपलोड करा',
      altText: 'चित्राचे वर्णन',
    },
    placeholders: {
      title: 'उदा., सफरचंद शोधा',
      instruction: 'उदा., लाल फळ कोणते आहे?',
      hint1: 'उदा., फळाचा रंग पहा.',
      hint2: 'उदा., गोल फळ शोधा.',
      successMsg: 'उदा., खूप छान! तुम्ही बरोबर ओळखले!',
      retryMsg: 'उदा., काळजीपूर्वक पहा आणि पुन्हा प्रयत्न करा.',
      customObjective: 'तुमचे उद्दिष्ट येथे लिहा…',
      search: 'प्रश्न शोधा…',
    },
    validation: {
      titleRequired: 'शीर्षक आवश्यक आहे.',
      instructionRequired: 'सूचना आवश्यक आहे.',
      objectiveRequired: 'शिकण्याचे उद्दिष्ट निवडा.',
      activityTypeRequired: 'उपक्रम प्रकार निवडा.',
      correctAnswerRequired: 'किमान एक बरोबर उत्तर आवश्यक आहे.',
      minOptions: 'किमान २ पर्याय आवश्यक आहेत.',
      imageTooLarge: 'चित्र ५ MB पेक्षा लहान असावे.',
      audioTooLarge: 'ऑडिओ १० MB पेक्षा लहान असावे.',
      invalidFileType: 'फाइल प्रकार समर्थित नाही.',
      languageIncomplete: 'निवडलेल्या भाषेसाठी सर्व आवश्यक माहिती भरा.',
    },
  },

  // ── Parent Dashboard ───────────────────────────────────────────────────
  parent: {
    dashboardTitle: 'पालक कक्ष (Parent Studio)',
    welcome: 'स्वागत आहे, पालक!',
    totalQuestions: 'एकूण प्रश्न',
    drafts: 'मसुदे',
    published: 'प्रकाशित प्रश्न',
    collections: 'संग्रह',
    recentQuestions: 'नुकतेच तयार केलेले प्रश्न',
    noQuestions: 'अद्याप कोणतेही प्रश्न नाहीत. तुमचा पहिला प्रश्न तयार करा!',
    createQuestion: 'नवीन प्रश्न तयार करा',
    viewAll: 'सर्व प्रश्न पहा',
    manageCollections: 'संग्रह व्यवस्थापित करा',
    childProfiles: 'मुलांची प्रोफाईल',
    learningProgress: 'शिकण्याची प्रगती',
    quickStats: 'झटपट आकडेवारी',
    gate: {
      title: 'पालक पडताळणी',
      subtitle: 'पालक कक्षात जाण्यासाठी ४ अंकी पिन प्रविष्ट करा.',
      pinPlaceholder: '••••',
      enterPin: 'पिन टाका',
      wrongPin: 'चुकीचा पिन. पुन्हा प्रयत्न करा.',
      mathQuestion: 'पालक चाचणी: {a} + {b} = ?',
      resetPin: 'पिन विसरलात?',
    },
    exportBtn: 'प्रश्न एक्सपोर्ट करा (JSON)',
    importBtn: 'प्रश्न इंपोर्ट करा (JSON)',
  },

  // ── Child Interface ─────────────────────────────────────────────────────
  child: {
    mascotName: 'मिलो (Milo)',
    miloGreetings: {
      morning: 'शुभ सकाळ! आज काय शिकायचे?',
      afternoon: 'शुभ दुपार! चला खेळूया!',
      evening: 'शुभ संध्याकाळ! नवीन साहस सुरू करूया!',
      general: 'हॅलो दोस्ता! आज आपण काय नवीन शिकूया?',
    },
    encouragements: [
      'शाब्बास!',
      'खूप छान विचार केलास!',
      'उत्तम!',
      'तू हुशार आहेस!',
      'अप्रतिम!',
      'वा! किती सुंदर!',
      'बरोबर उत्तर!',
      'मस्त खेळलास!',
      'छान प्रयत्न!',
      'तू रोज नवीन शिकत आहेस!',
    ],
    gentleRetries: [
      'पुन्हा एकदा पाहूया!',
      'काही हरकत नाही, पुन्हा प्रयत्न करा!',
      'जवळपास पोहोचलास!',
      'काळजीपूर्वक पाहा!',
      'तू हे करू शकतोस!',
      'आणखी एकदा विचार कर!',
    ],
    tapToStart: 'सुरू करण्यासाठी टॅप करा!',
    needHelp: 'मदत हवी आहे?',
    listenAgain: 'पुन्हा ऐका 🔊',
    wellDone: 'अभिनंदन! 🎉',
    completedLearning: 'आज तुम्ही शिकलात:',
    offlineChallenge: 'घरी करून पहा (Offline Activity):',
    tryAnother: 'दुसरा खेळ खेळा',
    backToWorld: 'जगाकडे परत जा',
  },

  // ── Feedback ────────────────────────────────────────────────────────────
  feedback: {
    correct: 'छान! बरोबर उत्तर!',
    tryAgain: 'पुन्हा प्रयत्न करा!',
    hint: 'सूचना / मदत',
    completed: 'उपक्रम पूर्ण झाला!',
  },

  // ── Errors ──────────────────────────────────────────────────────────────
  errors: {
    generic: 'एक अनपेक्षित त्रुटी आली.',
    notFound: 'उपक्रम सापडला नाही.',
    storageFailed: 'डेटा जतन करता आला नाही.',
    importFailed: 'फाइल इंपोर्ट अयशस्वी. फॉरमॅट तपासा.',
    audioPlayFailed: 'ऑडिओ प्ले करता आला नाही.',
  },

  // ── Accessibility ───────────────────────────────────────────────────────
  aria: {
    playAudio: 'सूचना ऐका',
    getHint: 'मदत मिळवा',
    closeModal: 'डायलॉग बंद करा',
    previousStep: 'मागील पायरी',
    nextStep: 'पुढील पायरी',
    deleteItem: 'घटक हटवा',
    editItem: 'घटक संपादित करा',
    selectLanguage: 'भाषा निवडा',
  },
};

export default mr;

