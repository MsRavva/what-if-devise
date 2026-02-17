import { Location, Item, GameState } from '@/types/adventure';

// Координаты локаций на карте (для визуализации)
export interface MapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  connections: string[];
  type: 'entrance' | 'room' | 'secret' | 'outdoor';
}

// Карта мира
export const worldMap: MapNode[] = [
  // Внешний мир
  { id: 'forest-road', x: 50, y: 90, label: 'Лес', connections: ['castle-entrance'], type: 'outdoor' },
  { id: 'castle-entrance', x: 50, y: 75, label: 'Вход', connections: ['forest-road', 'castle-hall', 'castle-garden', 'guard-house'], type: 'entrance' },
  { id: 'guard-house', x: 70, y: 75, label: 'Сторожка', connections: ['castle-entrance'], type: 'room' },
  { id: 'castle-garden', x: 30, y: 75, label: 'Сад', connections: ['castle-entrance', 'dungeon', 'fountain', 'castle-chapel'], type: 'outdoor' },
  { id: 'fountain', x: 20, y: 75, label: 'Фонтан', connections: ['castle-garden'], type: 'outdoor' },
  { id: 'castle-chapel', x: 30, y: 60, label: 'Часовня', connections: ['castle-garden'], type: 'room' },
  
  // Основной замок
  { id: 'castle-hall', x: 50, y: 60, label: 'Холл', connections: ['castle-entrance', 'library', 'dining-room', 'castle-upper'], type: 'room' },
  { id: 'library', x: 35, y: 60, label: 'Библиотека', connections: ['castle-hall', 'secret-room'], type: 'room' },
  { id: 'secret-room', x: 25, y: 60, label: 'Секрет', connections: ['library'], type: 'secret' },
  { id: 'dining-room', x: 65, y: 60, label: 'Столовая', connections: ['castle-hall', 'kitchen'], type: 'room' },
  { id: 'kitchen', x: 75, y: 60, label: 'Кухня', connections: ['dining-room', 'pantry', 'castle-cellar'], type: 'room' },
  { id: 'pantry', x: 85, y: 60, label: 'Кладовка', connections: ['kitchen'], type: 'room' },
  
  // Подземелья
  { id: 'castle-cellar', x: 75, y: 75, label: 'Погреб', connections: ['kitchen', 'catacombs'], type: 'room' },
  { id: 'catacombs', x: 75, y: 85, label: 'Катакомбы', connections: ['castle-cellar', 'ancient-temple'], type: 'room' },
  { id: 'ancient-temple', x: 75, y: 95, label: 'Храм', connections: ['catacombs'], type: 'secret' },
  { id: 'dungeon', x: 30, y: 85, label: 'Подзем.', connections: ['castle-garden'], type: 'room' },
  
  // Верхний этаж
  { id: 'castle-upper', x: 50, y: 45, label: '2 этаж', connections: ['castle-hall', 'lord-chamber', 'tower-left', 'servant-quarters', 'armory'], type: 'room' },
  { id: 'lord-chamber', x: 50, y: 30, label: 'Лорд', connections: ['castle-upper', 'balcony'], type: 'room' },
  { id: 'balcony', x: 60, y: 25, label: 'Балкон', connections: ['lord-chamber'], type: 'outdoor' },
  { id: 'tower-left', x: 35, y: 45, label: 'Башня', connections: ['castle-upper', 'observatory'], type: 'room' },
  { id: 'observatory', x: 25, y: 45, label: 'Обсерв.', connections: ['tower-left'], type: 'room' },
  { id: 'servant-quarters', x: 65, y: 45, label: 'Прислуга', connections: ['castle-upper'], type: 'room' },
  { id: 'armory', x: 50, y: 35, label: 'Оружей.', connections: ['castle-upper'], type: 'room' },
];

// Начальные предметы (будут копироваться для каждой игры)
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

// Функция для создания нового состояния игры
export function createInitialLocations(): Record<string, Location> {
  return {
    'castle-entrance': {
      id: 'castle-entrance',
      name: 'Главный вход в замок',
      description: 'Вы стоите перед массивными воротами старого замка.',
      detailedDescription: 'Главные ворота закрыты. Слева - калитка в сад, справа - сторожка. Впереди - вход в замок, назад - дорога в лес.',
      exits: [
        { direction: 'вперед', targetLocationId: 'castle-hall', description: 'в главный холл' },
        { direction: 'внутрь', targetLocationId: 'castle-hall', description: 'в главный холл' },
        { direction: 'калитка', targetLocationId: 'castle-garden', description: 'в сад' },
        { direction: 'сторожка', targetLocationId: 'guard-house', description: 'в сторожку' },
        { direction: 'назад', targetLocationId: 'forest-road', description: 'в лес' },
      ],
      items: [],
      visited: false,
    },
    
    'castle-hall': {
      id: 'castle-hall',
      name: 'Главный холл замка',
      description: 'Величественный холл с мраморной лестницей.',
      detailedDescription: 'В центре холла - широкая мраморная лестница на второй этаж. Слева - дверь в библиотеку, справа - арка в столовую. В углу играет лютня - путешествующий бард что-то напевает.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-entrance', description: 'наружу' },
        { direction: 'наружу', targetLocationId: 'castle-entrance', description: 'наружу' },
        { direction: 'вверх', targetLocationId: 'castle-upper', description: 'на второй этаж' },
        { direction: 'лестница', targetLocationId: 'castle-upper', description: 'на второй этаж' },
        { direction: 'лево', targetLocationId: 'library', description: 'в библиотеку' },
        { direction: 'библиотека', targetLocationId: 'library', description: 'в библиотеку' },
        { direction: 'право', targetLocationId: 'dining-room', description: 'в столовую' },
        { direction: 'столовая', targetLocationId: 'dining-room', description: 'в столовую' },
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
      detailedDescription: 'Высокие стены уходят в темноту, полностью покрытые полками с книгами. Пахнет старой бумагой и пылью. На полу что-то блестит. На одной из полок видна странная книга, торчащая - за ней что-то есть.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-hall', description: 'в холл' },
        { direction: 'холл', targetLocationId: 'castle-hall', description: 'в холл' },
        { direction: 'дверь', targetLocationId: 'secret-room', locked: true, requiredItem: 'key', description: 'в тайную комнату' },
        { direction: 'тайная', targetLocationId: 'secret-room', locked: true, requiredItem: 'key', description: 'в тайную комнату' },
      ],
      items: [{ ...initialItems.book, id: 'book-library' }],
      visited: false,
    },
    
    'secret-room': {
      id: 'secret-room',
      name: 'Тайная комната',
      description: 'Вы нашли сокровищницу!',
      detailedDescription: 'Небольшая комната, полная золота и драгоценностей. Древние артефакты лежат на полках. В центре - сундук с сокровищами.',
      exits: [
        { direction: 'назад', targetLocationId: 'library', description: 'в библиотеку' },
        { direction: 'библиотека', targetLocationId: 'library', description: 'в библиотеку' },
      ],
      items: [
        { ...initialItems.coin, id: 'coin-secret-1' },
        { ...initialItems.coin, id: 'coin-secret-2' },
        { ...initialItems.gem, id: 'gem-secret' },
      ],
      visited: false,
    },
    
    'dining-room': {
      id: 'dining-room',
      name: 'Столовая',
      description: 'Большая столовая с дубовым столом.',
      detailedDescription: 'Длинный дубовый стол накрыт для приема пищи, но посуда пуста. На стенах - портреты прежних хозяев. В дальнем конце комнаты - дверь на кухню.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-hall', description: 'в холл' },
        { direction: 'холл', targetLocationId: 'castle-hall', description: 'в холл' },
        { direction: 'кухня', targetLocationId: 'kitchen', description: 'на кухню' },
      ],
      items: [{ ...initialItems.potion, id: 'potion-dining' }],
      visited: false,
    },
    
    'kitchen': {
      id: 'kitchen',
      name: 'Кухня',
      description: 'Старая кухня с камином.',
      detailedDescription: 'Большой камин занимает целую стену. На столе - остатки приготовленной еды. В углу - дверь в кладовку. В полу - люк в погреб.',
      exits: [
        { direction: 'назад', targetLocationId: 'dining-room', description: 'в столовую' },
        { direction: 'столовая', targetLocationId: 'dining-room', description: 'в столовую' },
        { direction: 'кладовка', targetLocationId: 'pantry', description: 'в кладовку' },
        { direction: 'вниз', targetLocationId: 'castle-cellar', description: 'в погреб' },
        { direction: 'погреб', targetLocationId: 'castle-cellar', description: 'в погреб' },
      ],
      items: [],
      visited: false,
    },
    
    'pantry': {
      id: 'pantry',
      name: 'Кладовка',
      description: 'Темная кладовка с припасами.',
      detailedDescription: 'Узкое помещение с полками, заставленными банками и мешками. Пахнет специями. Кое-где видны паутины.',
      exits: [
        { direction: 'назад', targetLocationId: 'kitchen', description: 'на кухню' },
        { direction: 'кухня', targetLocationId: 'kitchen', description: 'на кухню' },
      ],
      items: [{ ...initialItems.potion, id: 'potion-pantry' }],
      visited: false,
    },
    
    'castle-upper': {
      id: 'castle-upper',
      name: 'Верхний этаж',
      description: 'Тихий коридор второго этажа.',
      detailedDescription: 'Коридор с ковровой дорожкой. Портреты на стенах кажутся живыми. Прямо - двустворчатые двери в спальню. Слева - узкая дверь в башню. Справа - дверь в комнату прислуги. Напротив - тяжелая дверь с гербом.',
      exits: [
        { direction: 'вниз', targetLocationId: 'castle-hall', description: 'вниз в холл' },
        { direction: 'назад', targetLocationId: 'castle-hall', description: 'вниз в холл' },
        { direction: 'спальня', targetLocationId: 'lord-chamber', description: 'в спальню лорда' },
        { direction: 'прямо', targetLocationId: 'lord-chamber', description: 'в спальню лорда' },
        { direction: 'башня', targetLocationId: 'tower-left', description: 'в башню' },
        { direction: 'лево', targetLocationId: 'tower-left', description: 'в башню' },
        { direction: 'прислуга', targetLocationId: 'servant-quarters', description: 'в комнату прислуги' },
        { direction: 'право', targetLocationId: 'servant-quarters', description: 'в комнату прислуги' },
        { direction: 'оружейная', targetLocationId: 'armory', description: 'в оружейную' },
      ],
      items: [],
      visited: false,
    },
    
    'lord-chamber': {
      id: 'lord-chamber',
      name: 'Спальня лорда',
      description: 'Роскошная спальня с балконом.',
      detailedDescription: 'Большая кровать с балдахином, шкафы, трюмо. На туалетном столике лежит пергамент. За шторами - дверь на балкон с видом на сады.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-upper', description: 'в коридор' },
        { direction: 'коридор', targetLocationId: 'castle-upper', description: 'в коридор' },
        { direction: 'балкон', targetLocationId: 'balcony', description: 'на балкон' },
      ],
      items: [{ ...initialItems.key, id: 'key-chamber' }],
      visited: false,
    },
    
    'tower-left': {
      id: 'tower-left',
      name: 'Башня',
      description: 'Узкая винтовая башня.',
      detailedDescription: 'Каменная лестница уходит вверх по спирали. Окна- бойницы пропускают немного света. Вверху виден свет.',
      exits: [
        { direction: 'вниз', targetLocationId: 'castle-upper', description: 'вниз в коридор' },
        { direction: 'назад', targetLocationId: 'castle-upper', description: 'вниз в коридор' },
        { direction: 'вверх', targetLocationId: 'observatory', description: 'в обсерваторию' },
        { direction: 'обсерватория', targetLocationId: 'observatory', description: 'в обсерваторию' },
      ],
      items: [{ ...initialItems.coin, id: 'coin-tower' }],
      visited: false,
    },
    
    'observatory': {
      id: 'observatory',
      name: 'Обсерватория',
      description: 'Круглая комната под куполом.',
      detailedDescription: 'Под прозрачным куполом видны звезды. В центре - массивный телескоп. На стенах - древние звездные карты и астролябии.',
      exits: [
        { direction: 'вниз', targetLocationId: 'tower-left', description: 'вниз в башню' },
        { direction: 'назад', targetLocationId: 'tower-left', description: 'вниз в башню' },
      ],
      items: [
        { ...initialItems.book, id: 'book-observatory' },
        { ...initialItems.coin, id: 'coin-observatory' },
      ],
      visited: false,
    },
    
    'castle-garden': {
      id: 'castle-garden',
      name: 'Замковый сад',
      description: 'Заросший сад с руинами беседки.',
      detailedDescription: 'Когда-то здесь были аккуратные клумбы, теперь все заросло. Справа - вход в подземелья. Прямо - фонтан. Слева - часовня.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-entrance', description: 'ко входу' },
        { direction: 'вход', targetLocationId: 'castle-entrance', description: 'ко входу' },
        { direction: 'подземелья', targetLocationId: 'dungeon', description: 'в подземелья' },
        { direction: 'фонтан', targetLocationId: 'fountain', description: 'к фонтану' },
        { direction: 'часовня', targetLocationId: 'castle-chapel', description: 'в часовню' },
      ],
      items: [{ ...initialItems.torch, id: 'torch-garden' }],
      visited: false,
    },
    
    'fountain': {
      id: 'fountain',
      name: 'Фонтан',
      description: 'Заброшенный фонтан с мхом.',
      detailedDescription: 'Сухой фонтан с мхом и трещинами. В центре - статуя дракона. В его лапе что-то блестит.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-garden', description: 'в сад' },
        { direction: 'сад', targetLocationId: 'castle-garden', description: 'в сад' },
      ],
      items: [{ ...initialItems.ring, id: 'ring-fountain' }],
      visited: false,
    },
    
    'castle-chapel': {
      id: 'castle-chapel',
      name: 'Часовня',
      description: 'Маленькая замковая часовня.',
      detailedDescription: 'Тихое священное место с алтарем. Витражи пропускают разноцветный свет. Пахнет ладаном. На скамейке лежит пожелтевший листок.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-garden', description: 'в сад' },
        { direction: 'сад', targetLocationId: 'castle-garden', description: 'в сад' },
      ],
      items: [{ ...initialItems.letter, id: 'letter-chapel' }],
      visited: false,
    },
    
    'dungeon': {
      id: 'dungeon',
      name: 'Подземелья',
      description: 'Темные подземелья.',
      detailedDescription: 'Темные коридоры с каменными стенами. Влажно и пахнет плесенью. Требуется свет!',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-garden', description: 'в сад' },
        { direction: 'сад', targetLocationId: 'castle-garden', description: 'в сад' },
      ],
      items: [{ ...initialItems.potion, id: 'potion-dungeon' }],
      visited: false,
    },
    
    'castle-cellar': {
      id: 'castle-cellar',
      name: 'Винный погреб',
      description: 'Темный винный погреб.',
      detailedDescription: 'Ряды бочек с вином тянутся вглубь. Запах дуба и спирта. Слева - лестница наверх, впереди - проход в катакомбы.',
      exits: [
        { direction: 'вверх', targetLocationId: 'kitchen', description: 'на кухню' },
        { direction: 'кухня', targetLocationId: 'kitchen', description: 'на кухню' },
        { direction: 'вперед', targetLocationId: 'catacombs', description: 'в катакомбы' },
        { direction: 'катакомбы', targetLocationId: 'catacombs', description: 'в катакомбы' },
      ],
      items: [{ ...initialItems.potion, id: 'potion-cellar' }],
      visited: false,
    },
    
    'catacombs': {
      id: 'catacombs',
      name: 'Катакомбы',
      description: 'Древние подземные коридоры.',
      detailedDescription: 'Темные коридоры уходят вглубь земли. На стенах - древние руны. Впереди - тусклый свет.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-cellar', description: 'в погреб' },
        { direction: 'погреб', targetLocationId: 'castle-cellar', description: 'в погреб' },
        { direction: 'вперед', targetLocationId: 'ancient-temple', description: 'в храм' },
        { direction: 'храм', targetLocationId: 'ancient-temple', description: 'в храм' },
      ],
      items: [{ ...initialItems.map, id: 'map-catacombs' }],
      visited: false,
    },
    
    'ancient-temple': {
      id: 'ancient-temple',
      name: 'Древний храм',
      description: 'Заброшенный храм под замком.',
      detailedDescription: 'Величественный зал с колоннами. В центре - алтарь с таинственным свечением. На стенах - фрески с изображением древних богов.',
      exits: [
        { direction: 'назад', targetLocationId: 'catacombs', description: 'в катакомбы' },
        { direction: 'катакомбы', targetLocationId: 'catacombs', description: 'в катакомбы' },
      ],
      items: [
        { ...initialItems.amulet, id: 'amulet-temple' },
        { ...initialItems.gem, id: 'gem-temple' },
      ],
      visited: false,
    },
    
    'balcony': {
      id: 'balcony',
      name: 'Балкон',
      description: 'Каменный балкон с видом на долину.',
      detailedDescription: 'Отсюда открывается захватывающий вид на весь замок, сады и далекие холмы. Видны дороги, уходящие вдаль. Свежий ветер обдувает лицо.',
      exits: [
        { direction: 'назад', targetLocationId: 'lord-chamber', description: 'в спальню' },
        { direction: 'спальня', targetLocationId: 'lord-chamber', description: 'в спальню' },
      ],
      items: [{ ...initialItems.coin, id: 'coin-balcony' }],
      visited: false,
    },
    
    'servant-quarters': {
      id: 'servant-quarters',
      name: 'Комната прислуги',
      description: 'Скромная комната для слуг.',
      detailedDescription: 'Несколько кроватей и сундуков. Все аккуратно, но бедно. На столе - дневник одного из слуг.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-upper', description: 'в коридор' },
        { direction: 'коридор', targetLocationId: 'castle-upper', description: 'в коридор' },
      ],
      items: [{ ...initialItems.potion, id: 'potion-servant' }],
      visited: false,
    },
    
    'armory': {
      id: 'armory',
      name: 'Оружейная',
      description: 'Комната с оружием и доспехами.',
      detailedDescription: 'Стены украшены различным оружием - мечи, топоры, копья. В углу - доспехи на стойках. Большой сундук заперт на замок.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-upper', description: 'в коридор' },
        { direction: 'коридор', targetLocationId: 'castle-upper', description: 'в коридор' },
      ],
      items: [{ ...initialItems.sword, id: 'sword-armory' }],
      visited: false,
    },
    
    'forest-road': {
      id: 'forest-road',
      name: 'Лесная дорога',
      description: 'Тропинка через дремучий лес.',
      detailedDescription: 'Старый торговый путь зарос мхом. Впереди виднеются башни замка. Назад - дорога уходит глубже в лес.',
      exits: [
        { direction: 'вперед', targetLocationId: 'castle-entrance', description: 'к замку' },
        { direction: 'замок', targetLocationId: 'castle-entrance', description: 'к замку' },
        { direction: 'назад', targetLocationId: 'forest-road', description: 'вглубь леса' },
      ],
      items: [],
      visited: false,
    },
    
    'guard-house': {
      id: 'guard-house',
      name: 'Сторожка',
      description: 'Комната замкового сторожа.',
      detailedDescription: 'Простая комната с койкой и столом. Пусто - сторожа не видно. На столе - расписание караулов.',
      exits: [
        { direction: 'назад', targetLocationId: 'castle-entrance', description: 'наружу' },
        { direction: 'наружу', targetLocationId: 'castle-entrance', description: 'наружу' },
      ],
      items: [],
      visited: false,
    },
  };
}

// Создаем начальное состояние игры
export function createInitialGameState(): GameState {
  const initialLocations = createInitialLocations();
  const startLocation = initialLocations['castle-entrance'];
  
  return {
    currentLocationId: 'castle-entrance',
    inventory: [],
    visitedLocations: ['castle-entrance'],
    gameLog: [
      {
        type: 'system',
        text: '🎮 Текстовое Приключение\n\nВы - искатель приключений, прибывший к старому замку по легендам о сокровищах.',
        timestamp: Date.now(),
      },
      {
        type: 'location',
        text: `**${startLocation.name}**\n\n${startLocation.detailedDescription}\n\n*Вы начинаете свое путешествие.*\n\n**Выходы:**\n• вперед (в главный холл)\n• калитка (в сад)\n• сторожка\n• назад (в лес)`,
        timestamp: Date.now(),
      }
    ],
    flags: {},
    turn: 0,
  };
}

// Глобальная переменная для текущего состояния локаций (будет создаваться для каждой сессии)
export let currentLocations: Record<string, Location> = createInitialLocations();

// Функция для сброса локаций
export function resetLocations(): Record<string, Location> {
  currentLocations = createInitialLocations();
  return currentLocations;
}
