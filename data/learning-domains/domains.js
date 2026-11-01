/**
 * @file domains.js
 * @description NCF-FS 2022 developmental domain definitions and learning objectives.
 */

export const LEARNING_DOMAINS = [
  {
    id: 'literacy',
    name: { en: 'Language & Literacy', mr: 'भाषा आणि साक्षरता' },
    icon: '🔤',
    color: '#8B5CF6',
    worlds: ['letter-land'],
    objectives: [
      { id: 'alphabet', name: { en: 'Alphabet Recognition', mr: 'अक्षर ओळख' } },
      { id: 'initial_sounds', name: { en: 'Beginning Sounds', mr: 'सुरुवातीचे ध्वनी' } },
      { id: 'vocabulary', name: { en: 'Listening & Vocabulary', mr: 'ऐकणे आणि शब्दसंग्रह' } },
      { id: 'word_picture', name: { en: 'Picture-Word Association', mr: 'चित्र आणि शब्द जुळवणे' } },
    ],
  },
  {
    id: 'numeracy',
    name: { en: 'Early Mathematics', mr: 'संख्या आणि गणित' },
    icon: '🔢',
    color: '#3B82F6',
    worlds: ['number-town'],
    objectives: [
      { id: 'counting', name: { en: 'Counting 1-10', mr: '१ ते १० मोजणी' } },
      { id: 'number_id', name: { en: 'Number Recognition', mr: 'संख्या ओळख' } },
      { id: 'quantity_match', name: { en: 'Number to Quantity', mr: 'संख्या आणि वस्तू जुळवणे' } },
      { id: 'number_order', name: { en: 'Number Sequencing', mr: 'संख्या क्रम' } },
    ],
  },
  {
    id: 'spatial',
    name: { en: 'Shapes & Patterns', mr: 'आकार आणि नमुने' },
    icon: '🔷',
    color: '#10B981',
    worlds: ['shape-garden'],
    objectives: [
      { id: 'shapes', name: { en: 'Shape Recognition', mr: 'आकार ओळख' } },
      { id: 'patterns', name: { en: 'Pattern Completion', mr: 'नमुना पूर्ण करणे' } },
      { id: 'shadows', name: { en: 'Shadow Matching', mr: 'सावली जुळवणे' } },
    ],
  },
  {
    id: 'nature',
    name: { en: 'Animals & Environment', mr: 'प्राणी आणि पर्यावरण' },
    icon: '🐾',
    color: '#F97316',
    worlds: ['animal-world'],
    objectives: [
      { id: 'animals', name: { en: 'Animal Recognition', mr: 'प्राणी ओळख' } },
      { id: 'habitats', name: { en: 'Farm & Wild Animals', mr: 'पाळीव आणि जंगली प्राणी' } },
      { id: 'fruits_veg', name: { en: 'Fruits & Vegetables', mr: 'फळे आणि भाज्या' } },
    ],
  },
  {
    id: 'cognitive',
    name: { en: 'Logical Thinking', mr: 'तार्किक विचार' },
    icon: '🧩',
    color: '#14B8A6',
    worlds: ['puzzle-planet'],
    objectives: [
      { id: 'differences', name: { en: 'Finding Differences', mr: 'फरक ओळखा' } },
      { id: 'memory', name: { en: 'Memory Match', mr: 'स्मृती जुळवणी' } },
      { id: 'sequencing', name: { en: 'Picture Story Sequencing', mr: 'चित्र कथा क्रम' } },
    ],
  },
  {
    id: 'social',
    name: { en: 'Feelings & Socio-Emotional', mr: 'भावना आणि मित्र' },
    icon: '💛',
    color: '#EAB308',
    worlds: ['feelings-friends'],
    objectives: [
      { id: 'emotions', name: { en: 'Recognizing Emotions', mr: 'भावना ओळखणे' } },
      { id: 'kindness', name: { en: 'Sharing & Empathy', mr: 'वाटून घेणे आणि दयाळूपणा' } },
    ],
  },
];

