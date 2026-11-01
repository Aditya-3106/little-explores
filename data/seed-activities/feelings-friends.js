/**
 * @file feelings-friends.js
 * @description Bilingual seed activities for Feelings & Friends (Socio-Emotional Learning).
 */

export const feelingsFriendsActivities = [
  {
    id: 'ff_01_story_sharing',
    title: 'Milo Shares His Toys',
    worldId: 'feelings-friends',
    domain: 'social',
    learningObjective: 'kindness',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'story-response',
    status: 'published',
    visibility: 'public_default',
    icon: '🤝',
    locales: {
      en: {
        title: 'Sharing is Caring',
        instruction: 'Listen to the story about Milo and answer!',
        story: 'Milo had two red apples. He saw his friend who was hungry, so Milo smiled and shared an apple!',
        question: 'What kind thing did Milo do?',
        options: ['He shared an apple 🍎', 'He ran away 🏃', 'He hid the food 🙈'],
        hint: 'Milo gave one apple to his friend.',
        success: 'Wonderful! Sharing brings joy to friends!',
        learned: 'Empathy, sharing, and understanding kindness.',
      },
      mr: {
        title: 'मिलोने सफरचंद वाटून खाल्ले',
        instruction: 'मिलोची गोष्ट ऐका आणि प्रश्नाचे उत्तर द्या!',
        story: 'मिलोकडे दोन लाल सफरचंद होते. त्याचा मित्र भुकेला होता, म्हणून मिलोने हसतमुखाने एक सफरचंद मित्राला दिले!',
        question: 'मिलोने काय चांगले काम केले?',
        options: ['सफरचंद वाटून खाल्ले 🍎', 'पळून गेला 🏃', 'अन्न लपवून ठेवले 🙈'],
        hint: 'मिलोने मित्राला सफरचंद दिले.',
        success: 'छान! वाटून खाल्ल्याने आनंद वाढतो!',
        learned: 'सहकार्य आणि दयाळूपणा.',
      },
    },
    payload: {
      storyEmoji: '🦊 🍎 🐰',
      correctAnswer: 0,
    },
  },
  {
    id: 'ff_02_emotions',
    title: 'How Does Milo Feel?',
    worldId: 'feelings-friends',
    domain: 'social',
    learningObjective: 'emotions',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'tap-select',
    status: 'published',
    visibility: 'public_default',
    icon: '😊',
    locales: {
      en: {
        title: 'Happy Milo',
        instruction: 'Milo just got a surprise gift! Which face shows Happy? 😊',
        hint: 'Look for a big bright smile!',
        success: 'Yes! That is a big happy smile!',
        learned: 'Recognising happy and positive facial expressions.',
      },
      mr: {
        title: 'मिलो कसा वाटतो आहे?',
        instruction: 'मिलोला एक सुंदर भेट मिळाली! आनंदी चेहरा कोणता आहे? 😊',
        hint: 'मोठे गोड हसू असलेला चेहरा पहा!',
        success: 'बरोबर! हा आनंदी चेहरा आहे!',
        learned: 'आनंदी भावमुद्रा ओळखणे.',
      },
    },
    payload: {
      options: [
        { id: 'o1', label: 'Happy / आनंदी', icon: '😄', correct: true },
        { id: 'o2', label: 'Sad / दुःखी', icon: '😢', correct: false },
        { id: 'o3', label: 'Sleepy / झोपाळू', icon: '😴', correct: false },
      ],
    },
  },
];

