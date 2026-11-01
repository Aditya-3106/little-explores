/**
 * @file animal-world.js
 * @description Bilingual seed activities for Animal World (Environment & Nature).
 */

export const animalWorldActivities = [
  {
    id: 'aw_01_sort_animals',
    title: 'Sort Farm & Wild Animals',
    worldId: 'animal-world',
    domain: 'nature',
    learningObjective: 'habitats',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'sorting',
    status: 'published',
    visibility: 'public_default',
    icon: '🐾',
    locales: {
      en: {
        title: 'Sort Animals',
        instruction: 'Tap an animal, then tap its home (Farm or Jungle)!',
        hint: 'Cows live on farms, lions live in jungles!',
        success: 'All animals are safely sorted!',
        learned: 'Classifying animals by their habitats.',
      },
      mr: {
        title: 'प्राण्यांचे वर्गीकरण करा',
        instruction: 'प्राणी निवडा आणि त्याच्या घरात (घर किंवा जंगल) ठेवा!',
        hint: 'गाय गोठ्यात राहते, सिंह जंगलात राहतो!',
        success: 'सर्व प्राण्यांचे योग्य वर्गीकरण झाले!',
        learned: 'पाळीव आणि जंगली प्राण्यांमधील फरक.',
      },
    },
    payload: {
      categories: [
        { id: 'farm', name: 'Farm Animals', icon: '🏡' },
        { id: 'wild', name: 'Jungle Animals', icon: '🌴' },
      ],
      items: [
        { id: 'i1', label: 'Cow', icon: '🐄', categoryId: 'farm' },
        { id: 'i2', label: 'Lion', icon: '🦁', categoryId: 'wild' },
        { id: 'i3', label: 'Sheep', icon: '🐑', categoryId: 'farm' },
        { id: 'i4', label: 'Elephant', icon: '🐘', categoryId: 'wild' },
      ],
    },
  },
  {
    id: 'aw_02_animal_shadows',
    title: 'Animal Shadow Matching',
    worldId: 'animal-world',
    domain: 'nature',
    learningObjective: 'animals',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'shadow-matching',
    status: 'published',
    visibility: 'public_default',
    icon: '🦒',
    locales: {
      en: {
        title: 'Match Animal Shadows',
        instruction: 'Tap an animal, then tap its matching dark shadow!',
        hint: 'Look at the long neck of the giraffe!',
        success: 'You found all animal shadows!',
        learned: 'Visual silhouette recognition and observation.',
      },
      mr: {
        title: 'प्राण्यांची सावली जुळवा',
        instruction: 'प्राणी निवडा आणि त्याची सावली टॅप करा!',
        hint: 'जिराफाची लांब मान पहा!',
        success: 'सर्व प्राण्यांच्या सावल्या बरोबर ओळखल्यात!',
        learned: 'आकाराचे बाह्यरेषा निरीक्षण.',
      },
    },
    payload: {
      pairs: [
        { id: 'p1', object: '🦒', label: 'Giraffe' },
        { id: 'p2', object: '🐘', label: 'Elephant' },
        { id: 'p3', object: '🦁', label: 'Lion' },
      ],
    },
  },
];

