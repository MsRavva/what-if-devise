import { Location, Item, GameState, GameLogEntry } from '@/types/adventure';

// Начальные предметы
export const initialItems: Record<string, Item> = {
  key: {
    id: 'key',
    name: 'Старый ключ',
    description: 'Ржавый железный ключ. Похоже, он от чего-то важного.',
    takeable: true,
  },
  torch: {
    id: 'torch',
    name: 'Факел',
    description: 'Горящий факел. Освещает путь в темноте.',
    takeable: true,
    usable: true,
  },
  coin: {
    id: 'coin',
    name: 'Золотая монета',
    description: 'Старинная золотая монета с изображением дракона.',
    takeable: true,
  },
  sword: {
    id: 'sword',
    name: 'Ржавый меч',
    description: 'Старый ржавый меч, но все еще острый.',
    takeable: true,
    usable: true,
  },
  book: {
    id: 'book',
    name: 'Пыльный фолиант',
    description: 'Старая книга с таинственными символами на обложке.',
    takeable: true,
  },
  potion: {
    id: 'potion',
    name: 'Зелье здоровья',
    description: 'Красное зелье в стеклянном флаконе.',
    takeable: true,
    usable: true,
  },
  ring: {
    id: 'ring',
    name: 'Магическое кольцо',
    description: 'Серебряное кольцо с синим камнем. Излучает слабое свечение.',
    takeable: true,
    usable: true,
  },
  map: {
    id: 'map',
    name: 'Карта замка',
    description: 'Старая пергаментная карта с отметками секретных проходов.',
    takeable: true,
  },
  amulet: {
    id: 'amulet',
    name: 'Амулет защиты',
    description: 'Древний амулет, защищающий от темной магии.',
    takeable: true,
  },
  letter: {
    id: 'letter',
    name: 'Записка',
    description: 'Письмо с пятнами чернил. Часть текста неразборчива.',
    takeable: true,
  },
  gem: {
    id: 'gem',
    name: 'Красный рубин',
    description: 'Блестящий драгоценный камень необычайной красоты.',
    takeable: true,
  },
};

// Начальное состояние игры
export const initialGameState: GameState = {
  currentLocationId: 'castle-entrance',
  inventory: [],
  visitedLocations: ['castle-entrance'],
  gameLog: [
    {
      type: 'system',
      text: '🎮 Добро пожаловать в текстовое приключение!\n\nВы стоите перед старым замком. Ваше приключение начинается здесь.',
      timestamp: Date.now(),
    },
    {
      type: 'location',
      text: '**Главный вход в замок**\n\nВы стоите перед массивными воротами старого замка. Главные ворота закрыты. Слева - калитка, справа - сторожка. Впереди - вход в замок, назад - дорога в лес.\n\n*Вы начинаете свое путешествие.*\n\n**Выходы:**\n• вперед\n• внутрь\n• калитка\n• сторожка\n• назад',
      timestamp: Date.now(),
    }
  ],
  flags: {},
  turn: 0,
};

// Локации мира
export const locations: Record<string, Location> = {
  'castle-entrance': {
    id: 'castle-entrance',
    name: 'Главный вход в замок',
    description: 'Вы стоите перед массивными воротами старого замка.',
    detailedDescription: 'Главные ворота закрыты. Слева - калитка, справа - сторожка. Впереди - вход в замок, назад - дорога в лес.',
    exits: [
      { direction: 'вперед', targetLocationId: 'castle-hall' },
      { direction: 'внутрь', targetLocationId: 'castle-hall' },
      { direction: 'калитка', targetLocationId: 'castle-garden' },
      { direction: 'сторожка', targetLocationId: 'guard-house' },
      { direction: 'назад', targetLocationId: 'forest-road' },
    ],
    items: [],
    visited: false,
  },
  
  'castle-hall': {
    id: 'castle-hall',
    name: 'Главный холл замка',
    description: 'Величественный холл с мраморной лестницей.',
    detailedDescription: 'В центре - лестница наверх. Слева - библиотека, справа - столовая. Бард играет в углу.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-entrance' },
      { direction: 'вверх', targetLocationId: 'castle-upper' },
      { direction: 'лестница', targetLocationId: 'castle-upper' },
      { direction: 'левая', targetLocationId: 'library' },
      { direction: 'библиотека', targetLocationId: 'library' },
      { direction: 'правая', targetLocationId: 'dining-room' },
      { direction: 'столовая', targetLocationId: 'dining-room' },
    ],
    items: [{ ...initialItems.coin, id: 'coin-hall' }],
    npcs: [{
      id: 'bard',
      name: 'Бард',
      description: 'Путешествующий менестрель.',
      dialogue: ['Добро пожаловать в замок!', 'Говорят, в подземельях спрятано сокровище...']
    }],
    visited: false,
  },
  
  'library': {
    id: 'library',
    name: 'Библиотека',
    description: 'Огромная библиотека с древними книгами.',
    detailedDescription: 'На полках - тысячи книг. В углу что-то блестит. На стене видна тайная дверь.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-hall' },
      { direction: 'холл', targetLocationId: 'castle-hall' },
      { direction: 'дверь', targetLocationId: 'secret-room', locked: true, requiredItem: 'key' },
    ],
    items: [{ ...initialItems.book, id: 'book-library' }],
    visited: false,
  },
  
  'secret-room': {
    id: 'secret-room',
    name: 'Тайная комната',
    description: 'Вы нашли сокровищницу!',
    detailedDescription: 'Золото и драгоценности сверкают в темноте.',
    exits: [
      { direction: 'назад', targetLocationId: 'library' },
    ],
    items: [
      { ...initialItems.coin, id: 'coin-secret-1' },
      { ...initialItems.coin, id: 'coin-secret-2' },
    ],
    visited: false,
  },
  
  'dining-room': {
    id: 'dining-room',
    name: 'Столовая',
    description: 'Большая столовая с дубовым столом.',
    detailedDescription: 'На столе - остатки трапезы. В углу - дверь на кухню.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-hall' },
      { direction: 'холл', targetLocationId: 'castle-hall' },
      { direction: 'кухня', targetLocationId: 'kitchen' },
    ],
    items: [{ ...initialItems.potion, id: 'potion-dining' }],
    visited: false,
  },
  
  'kitchen': {
    id: 'kitchen',
    name: 'Кухня',
    description: 'Старая кухня с камином.',
    detailedDescription: 'На столе - посуда. В углу - кладовка. Вниз по лестнице - погреб.',
    exits: [
      { direction: 'назад', targetLocationId: 'dining-room' },
      { direction: 'столовая', targetLocationId: 'dining-room' },
      { direction: 'кладовка', targetLocationId: 'pantry' },
      { direction: 'вниз', targetLocationId: 'castle-cellar' },
      { direction: 'погреб', targetLocationId: 'castle-cellar' },
    ],
    items: [],
    visited: false,
  },
  
  'pantry': {
    id: 'pantry',
    name: 'Кладовка',
    description: 'Темная кладовка.',
    detailedDescription: 'На полках - припасы.',
    exits: [
      { direction: 'назад', targetLocationId: 'kitchen' },
    ],
    items: [{ ...initialItems.potion, id: 'potion-pantry' }],
    visited: false,
  },
  
  'castle-upper': {
    id: 'castle-upper',
    name: 'Верхний этаж',
    description: 'Тихий коридор.',
    detailedDescription: 'Прямо - спальня лорда. Слева - башня. Справа - комната прислуги. Дверь напротив - оружейная.',
    exits: [
      { direction: 'вниз', targetLocationId: 'castle-hall' },
      { direction: 'назад', targetLocationId: 'castle-hall' },
      { direction: 'спальня', targetLocationId: 'lord-chamber' },
      { direction: 'прямо', targetLocationId: 'lord-chamber' },
      { direction: 'башня', targetLocationId: 'tower-left' },
      { direction: 'левая', targetLocationId: 'tower-left' },
      { direction: 'прислуга', targetLocationId: 'servant-quarters' },
      { direction: 'правая', targetLocationId: 'servant-quarters' },
      { direction: 'оружейная', targetLocationId: 'armory' },
    ],
    items: [],
    visited: false,
  },
  
  'lord-chamber': {
    id: 'lord-chamber',
    name: 'Спальня лорда',
    description: 'Роскошная спальня.',
    detailedDescription: 'На тумбочке - письмо. За занавеской - балкон.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-upper' },
      { direction: 'коридор', targetLocationId: 'castle-upper' },
      { direction: 'балкон', targetLocationId: 'balcony' },
    ],
    items: [{ ...initialItems.key, id: 'key-chamber' }],
    visited: false,
  },
  
  'tower-left': {
    id: 'tower-left',
    name: 'Башня',
    description: 'Узкая башня.',
    detailedDescription: 'Отсюда видны окрестности. Вверх по лестнице - обсерватория.',
    exits: [
      { direction: 'вниз', targetLocationId: 'castle-upper' },
      { direction: 'назад', targetLocationId: 'castle-upper' },
      { direction: 'вверх', targetLocationId: 'observatory' },
      { direction: 'обсерватория', targetLocationId: 'observatory' },
    ],
    items: [{ ...initialItems.coin, id: 'coin-tower' }],
    visited: false,
  },
  
  'castle-garden': {
    id: 'castle-garden',
    name: 'Сад',
    description: 'Заросший сад.',
    detailedDescription: 'Справа - вход в подземелья, прямо - фонтан, слева - часовня.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-entrance' },
      { direction: 'подземелья', targetLocationId: 'dungeon' },
      { direction: 'фонтан', targetLocationId: 'fountain' },
      { direction: 'часовня', targetLocationId: 'castle-chapel' },
    ],
    items: [{ ...initialItems.torch, id: 'torch-garden' }],
    visited: false,
  },
  
  'dungeon': {
    id: 'dungeon',
    name: 'Подземелья',
    description: 'Темные подземелья.',
    detailedDescription: 'Требуется свет!',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-garden' },
    ],
    items: [{ ...initialItems.potion, id: 'potion-dungeon' }],
    visited: false,
  },
  
  'guard-house': {
    id: 'guard-house',
    name: 'Сторожка',
    description: 'Комната сторожа.',
    detailedDescription: 'Пустая комната.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-entrance' },
    ],
    items: [],
    visited: false,
  },
  
  'forest-road': {
    id: 'forest-road',
    name: 'Лесная дорога',
    description: 'Дорога в лес.',
    detailedDescription: 'Впереди - замок.',
    exits: [
      { direction: 'вперед', targetLocationId: 'castle-entrance' },
      { direction: 'замок', targetLocationId: 'castle-entrance' },
    ],
    items: [],
    visited: false,
  },

  // Новые локации
  'castle-cellar': {
    id: 'castle-cellar',
    name: 'Винный погреб',
    description: 'Темный винный погреб.',
    detailedDescription: 'Ряды бочек с вином тянутся вглубь. Слева - лестница наверх, впереди - проход в катакомбы.',
    exits: [
      { direction: 'вверх', targetLocationId: 'kitchen' },
      { direction: 'кухня', targetLocationId: 'kitchen' },
      { direction: 'вперед', targetLocationId: 'catacombs' },
      { direction: 'катакомбы', targetLocationId: 'catacombs' },
    ],
    items: [{ ...initialItems.potion, id: 'potion-cellar' }],
    visited: false,
  },

  'catacombs': {
    id: 'catacombs',
    name: 'Катакомбы',
    description: 'Древние подземные коридоры.',
    detailedDescription: 'Темные коридоры уходят вглубь земли. Нужен источник света! На стенах - древние руны.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-cellar' },
      { direction: 'погреб', targetLocationId: 'castle-cellar' },
      { direction: 'вперед', targetLocationId: 'ancient-temple' },
      { direction: 'храм', targetLocationId: 'ancient-temple' },
    ],
    items: [{ ...initialItems.map, id: 'map-catacombs' }],
    visited: false,
  },

  'ancient-temple': {
    id: 'ancient-temple',
    name: 'Древний храм',
    description: 'Заброшенный храм под замком.',
    detailedDescription: 'Величественный зал с колоннами. В центре - алтарь с таинственным свечением.',
    exits: [
      { direction: 'назад', targetLocationId: 'catacombs' },
      { direction: 'катакомбы', targetLocationId: 'catacombs' },
    ],
    items: [
      { ...initialItems.amulet, id: 'amulet-temple' },
      { ...initialItems.gem, id: 'gem-temple' },
    ],
    visited: false,
  },

  'castle-chapel': {
    id: 'castle-chapel',
    name: 'Часовня',
    description: 'Маленькая замковая часовня.',
    detailedDescription: 'Тихое священное место. Свет проникает через витражи. Прямо - алтарь, назад - выход в сад.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-garden' },
      { direction: 'сад', targetLocationId: 'castle-garden' },
    ],
    items: [{ ...initialItems.letter, id: 'letter-chapel' }],
    visited: false,
  },

  'fountain': {
    id: 'fountain',
    name: 'Фонтан',
    description: 'Заброшенный фонтан в саду.',
    detailedDescription: 'Сухой фонтан с мхом. В центре - статуя дракона. Что-то блестит в лапе статуи.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-garden' },
      { direction: 'сад', targetLocationId: 'castle-garden' },
    ],
    items: [{ ...initialItems.ring, id: 'ring-fountain' }],
    visited: false,
  },

  'observatory': {
    id: 'observatory',
    name: 'Обсерватория',
    description: 'Башня с телескопом.',
    detailedDescription: 'Круглая комната под куполом. В центре - древний телескоп. На стенах - звездные карты.',
    exits: [
      { direction: 'вниз', targetLocationId: 'tower-left' },
      { direction: 'башня', targetLocationId: 'tower-left' },
    ],
    items: [
      { ...initialItems.book, id: 'book-observatory' },
      { ...initialItems.coin, id: 'coin-observatory' },
    ],
    visited: false,
  },

  'armory': {
    id: 'armory',
    name: 'Оружейная',
    description: 'Комната с оружием.',
    detailedDescription: 'Стены украшены мечами и щитами. В углу - сундук. Заперто на замок.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-upper' },
      { direction: 'коридор', targetLocationId: 'castle-upper' },
    ],
    items: [{ ...initialItems.sword, id: 'sword-armory' }],
    visited: false,
  },

  'servant-quarters': {
    id: 'servant-quarters',
    name: 'Комната прислуги',
    description: 'Скромная комната.',
    detailedDescription: 'Нескко кроватей и сундуков. Кто-то здесь жил. На столе - дневник.',
    exits: [
      { direction: 'назад', targetLocationId: 'castle-upper' },
      { direction: 'коридор', targetLocationId: 'castle-upper' },
    ],
    items: [{ ...initialItems.potion, id: 'potion-servant' }],
    visited: false,
  },

  'balcony': {
    id: 'balcony',
    name: 'Балкон',
    description: 'Каменный балкон.',
    detailedDescription: 'Отсюда открывается вид на весь замок и окрестности. Внизу - сад.',
    exits: [
      { direction: 'назад', targetLocationId: 'lord-chamber' },
      { direction: 'спальня', targetLocationId: 'lord-chamber' },
    ],
    items: [{ ...initialItems.coin, id: 'coin-balcony' }],
    visited: false,
  },
};
