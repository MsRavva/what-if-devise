import { Location, Item, GameState, GameLogEntry } from '@/types/adventure';

// Типы концовок
export type EndingType = 
  | 'frozen_jump'      // 1 - Увы и ах! Прыжок с балкона
  | 'caught_manac'     // 2 - Неудача! Попасться маньяку
  | 'shredder_meat'    // 3 - МЯСО! Упасть в шредер
  | 'forgot_potion'    // 4 - Ты ничего не забыл? Без превращения
  | 'eaten_by_pig'     // 5 - Не лезь, оно тебя сожрет! Попасться свинье
  | 'pig_chase'        // 6 - Да ну? Сбежать но свинья догнала
  | 'true_escape';     // 7 - Ну наконец-то! Правильный побег

// Расширенное состояние игры
export interface HorrorGameState extends GameState {
  isDark: boolean;
  isDaytime: boolean;
  sleepCount: number;
  hasLight: boolean;
  discoveredConnections: string[][];
  previousLocationId: string | null;
  craftedItems: string[];
  cookedMeals: string[];
  unlockedDoors: string[];
  // Состояния маньяка
  maniacLocation: string;        // Где находится маньяк
  maniacAsleep: boolean;         // Усыплен ли маньяк
  maniacTurnedToPig: boolean;    // Превращен ли в свинью
  maniacFed: boolean;            // Кормили ли маньяка смесью
  // Концовка
  ending: EndingType | null;
  gameOver: boolean;
}

// Все предметы игры
export const horrorItems: Record<string, Item> = {
  // Источники света
  flashlight: {
    id: 'flashlight',
    name: 'Фонарик',
    description: 'Старый фонарик. Горит тускло, но помогает ориентироваться в темноте.',
    takeable: true,
    usable: true,
  },
  matches: {
    id: 'matches',
    name: 'Спички',
    description: 'Коробок спичек. Несколько штук осталось.',
    takeable: true,
    usable: true,
  },
  
  // Ключи
  key1: {
    id: 'key1',
    name: 'Ключ №1',
    description: 'Маленький латунный ключ. На бирке написано "Шкаф".',
    takeable: true,
  },
  key2: {
    id: 'key2',
    name: 'Ключ №2',
    description: 'Средний железный ключ. Тяжелый, для массивных дверей.',
    takeable: true,
  },
  key3: {
    id: 'key3',
    name: 'Ключ №3',
    description: 'Длинный серебристый ключ. Похоже, от ящика или сейфа.',
    takeable: true,
  },
  key4: {
    id: 'key4',
    name: 'Ключ №4',
    description: 'Маленький ключ с красной ленточкой. Главный ключ от выхода?',
    takeable: true,
  },
  
  // Медикаменты и инъекции
  sleepingPills: {
    id: 'sleepingPills',
    name: 'Снотворное',
    description: 'Таблетки в баночке. Можно растворить или принять.',
    takeable: true,
    usable: true,
  },
  pigInjection: {
    id: 'pigInjection',
    name: 'Свиная инъекция',
    description: 'Шприц с странной жидкостью. На этикетке свиной символ.',
    takeable: true,
    usable: true,
  },
  mixedInjection: {
    id: 'mixedInjection',
    name: 'Смесь инъекций',
    description: 'Объединенное снотворное со свиной инъекцией. Что это делает?',
    takeable: true,
    usable: true,
  },
  
  // Еда и кухня
  rawChicken: {
    id: 'rawChicken',
    name: 'Сырая курица',
    description: 'Тушка курицы. Нужно приготовить.',
    takeable: true,
  },
  grilledChicken: {
    id: 'grilledChicken',
    name: 'Курица-гриль',
    description: 'Аппетитная жареная курица. Пахнет вкусно!',
    takeable: true,
    usable: true,
  },
  tray: {
    id: 'tray',
    name: 'Поднос',
    description: 'Металлический поднос. Можно использовать для подачи еды.',
    takeable: true,
    usable: true,
  },
  
  // Инструменты
  screwdriver: {
    id: 'screwdriver',
    name: 'Отвертка',
    description: 'Крестовая отвертка. Пригодится для разборки вещей.',
    takeable: true,
    usable: true,
  },
  ventCover: {
    id: 'ventCover',
    name: 'Решетка вентиляции',
    description: 'Снятая решетка. Теперь проход открыт!',
    takeable: false,
  },
  
  // Записки и бумаги
  note1: {
    id: 'note1',
    name: 'Записка №1',
    description: 'Кривой почерк: "Ключ №1 в ванной, за зеркалом..."',
    takeable: true,
  },
  note2: {
    id: 'note2',
    name: 'Записка №2',
    description: '"Смесь снотворного и свиной инъекции делает их... спокойными"',
    takeable: true,
  },
  note3: {
    id: 'note3',
    name: 'Записка №3',
    description: '"Ключ №3 дает тот, кто не спит. Но как не спать?"',
    takeable: true,
  },
  recipe: {
    id: 'recipe',
    name: 'Рецепт курицы',
    description: '"Курица-гриль: сырая курица + поднос. Готовить 5 минут."',
    takeable: true,
  },
  
  // Прочее
  blanket: {
    id: 'blanket',
    name: 'Одеяло',
    description: 'Теплое одеяло. Можно укрыться и поспать.',
    takeable: true,
    usable: true,
  },
  switch: {
    id: 'switch',
    name: 'Выключатель',
    description: 'Настенный выключатель света.',
    takeable: false,
    usable: true,
  },
};

// Функция создания локаций
export function createHorrorLocations(): Record<string, Location> {
  return {
    // ==================== ТРЕТИЙ ЭТАЖ (старт) ====================
    'bedroom': {
      id: 'bedroom',
      name: 'Спальня',
      description: 'Темная спальня. Вы просыпаетесь здесь.',
      detailedDescription: 'Вы просыпаетесь в незнакомой кровати. Комната погружена во тьму - кажется, сейчас ночь, или выключен свет. На тумбочке что-то есть. На стене - выключатель?',
      exits: [
        { direction: 'дверь', targetLocationId: 'third-floor-hall', description: 'в коридор' },
        { direction: 'балкон', targetLocationId: 'balcony', description: 'на балкон' },
      ],
      items: [
        { ...horrorItems.blanket, id: 'blanket-bed' },
        { ...horrorItems.matches, id: 'matches-nightstand' },
        { ...horrorItems.note1, id: 'note1-table' },
      ],
      visited: true,
    },
    
    'balcony': {
      id: 'balcony',
      name: 'Балкон',
      description: 'Балкон с видом на двор.',
      detailedDescription: 'Вы выходите на балкон. Холодный ночной воздух. Внизу видны огни города, но далеко. Третий этаж - высоко. Очень высоко. Можно прыгнуть... но это безумие. Справа - пожарная лестница. Для прыжка используйте команду "прыгнуть".',
      exits: [
        { direction: 'назад', targetLocationId: 'bedroom', description: 'в спальню' },
        { direction: 'лестница', targetLocationId: 'fire-escape', description: 'по пожарной лестнице' },
      ],
      items: [],
      visited: false,
    },
    
    'balcony-jump': {
      id: 'balcony-jump',
      name: 'Падение',
      description: 'Вы прыгнули...',
      detailedDescription: 'Вы решаете прыгнуть с балкона. Третий этаж. Ветер свистит в ушах. Земля приближается...',
      exits: [],
      items: [],
      visited: false,
    },
    
    'fire-escape': {
      id: 'fire-escape',
      name: 'Пожарная лестница',
      description: 'Металлическая лестница на фасаде.',
      detailedDescription: 'Ржавая пожарная лестница. Внизу - земля, но очень далеко. Опасно спускаться без света. Можно спуститься на этаж ниже.',
      exits: [
        { direction: 'вверх', targetLocationId: 'balcony', description: 'на балкон' },
        { direction: 'вниз', targetLocationId: 'second-balcony', description: 'на второй этаж' },
      ],
      items: [{ ...horrorItems.flashlight, id: 'flashlight-ledge' }],
      visited: false,
    },
    
    'third-floor-hall': {
      id: 'third-floor-hall',
      name: 'Коридор 3 этажа',
      description: 'Длинный коридор с дверями.',
      detailedDescription: 'Коридор третьего этажа. Темно. Слева - ванная комната. Прямо - кухня. Справа - лестница вниз. Также есть дверь в кладовку.',
      exits: [
        { direction: 'спальня', targetLocationId: 'bedroom', description: 'в спальню' },
        { direction: 'ванная', targetLocationId: 'bathroom', description: 'в ванную' },
        { direction: 'кухня', targetLocationId: 'kitchen', description: 'на кухню' },
        { direction: 'кладовка', targetLocationId: 'pantry', description: 'в кладовку', locked: true, requiredItem: 'key1' },
        { direction: 'вниз', targetLocationId: 'second-floor-hall', description: 'вниз на второй этаж' },
      ],
      items: [],
      visited: false,
    },
    
    'bathroom': {
      id: 'bathroom',
      name: 'Ванная комната',
      description: 'Ванная с зеркалом.',
      detailedDescription: 'Ванная комната. Зеркало на стене. Тумба под раковиной. Кажется, что-то за зеркалом?',
      exits: [
        { direction: 'назад', targetLocationId: 'third-floor-hall', description: 'в коридор' },
      ],
      items: [
        { ...horrorItems.sleepingPills, id: 'pills-cabinet' },
        { ...horrorItems.key1, id: 'key1-behind-mirror' },
      ],
      visited: false,
    },
    
    'kitchen': {
      id: 'kitchen',
      name: 'Кухня',
      description: 'Кухня с плитой и холодильником.',
      detailedDescription: 'Кухня. Газовая плита, холодильник, стол. Здесь можно что-то приготовить. На стене висит рецепт.',
      exits: [
        { direction: 'назад', targetLocationId: 'third-floor-hall', description: 'в коридор' },
      ],
      items: [
        { ...horrorItems.rawChicken, id: 'chicken-fridge' },
        { ...horrorItems.tray, id: 'tray-shelf' },
        { ...horrorItems.recipe, id: 'recipe-wall' },
        { ...horrorItems.note2, id: 'note2-table' },
      ],
      visited: false,
    },
    
    'pantry': {
      id: 'pantry',
      name: 'Кладовка',
      description: 'Запертая кладовка.',
      detailedDescription: 'Тесная кладовка. Полки с консервами. В углу - старый шкафчик. Что-то лежит на верхней полке.',
      exits: [
        { direction: 'назад', targetLocationId: 'third-floor-hall', description: 'в коридор' },
      ],
      items: [
        { ...horrorItems.pigInjection, id: 'injection-shelf' },
        { ...horrorItems.note3, id: 'note3-cabinet' },
      ],
      visited: false,
    },
    
    // ==================== ВТОРОЙ ЭТАЖ ====================
    'second-floor-hall': {
      id: 'second-floor-hall',
      name: 'Коридор 2 этажа',
      description: 'Коридор второго этажа.',
      detailedDescription: 'Второй этаж. Здесь тише. Слева - комната со шредером. Прямо - прачечная. Справа - лестница вниз.',
      exits: [
        { direction: 'вверх', targetLocationId: 'third-floor-hall', description: 'на третий этаж' },
        { direction: 'шредер', targetLocationId: 'shredder-room', description: 'в комнату со шредером' },
        { direction: 'прачечная', targetLocationId: 'laundry', description: 'в прачечную' },
        { direction: 'вниз', targetLocationId: 'first-floor-hall', description: 'вниз на первый этаж' },
      ],
      items: [],
      visited: false,
    },
    
    'shredder-room': {
      id: 'shredder-room',
      name: 'Комната со шредером',
      description: 'Комната с промышленным шредером.',
      detailedDescription: 'Комната с большим промышленным шредером. Огромное устройство с острыми лезвиями. Может измельчить всё. Опасно. Рядом - стол с кнопкой.',
      exits: [
        { direction: 'назад', targetLocationId: 'second-floor-hall', description: 'в коридор' },
        { direction: 'в шредер', targetLocationId: 'shredder-death', description: '!!!' },
      ],
      items: [
        { ...horrorItems.switch, id: 'shredder-button' },
      ],
      visited: false,
    },
    
    'shredder-death': {
      id: 'shredder-death',
      name: 'Шредер',
      description: 'МЯСО!',
      detailedDescription: 'Вы упали в шредер. Острые лезвия...',
      exits: [],
      items: [],
      visited: false,
    },
    
    'laundry': {
      id: 'laundry',
      name: 'Прачечная',
      description: 'Прачечная со стиралками.',
      detailedDescription: 'Прачечная. Стиральные машины. В одной из них - барахло. На полу - корзина с грязным бельем.',
      exits: [
        { direction: 'назад', targetLocationId: 'second-floor-hall', description: 'в коридор' },
      ],
      items: [
        { ...horrorItems.screwdriver, id: 'screwdriver-basket' },
        { ...horrorItems.key2, id: 'key2-washer' },
      ],
      visited: false,
    },
    
    'second-balcony': {
      id: 'second-balcony',
      name: 'Балкон 2 этажа',
      description: 'Балкон второго этажа.',
      detailedDescription: 'Балкон второго этажа. Здесь ближе к земле. Видно входную дверь внизу.',
      exits: [
        { direction: 'вверх', targetLocationId: 'fire-escape', description: 'вверх по лестнице' },
        { direction: 'внутрь', targetLocationId: 'second-floor-hall', description: 'внутрь' },
      ],
      items: [],
      visited: false,
    },
    
    // ==================== ПЕРВЫЙ ЭТАЖ ====================
    'first-floor-hall': {
      id: 'first-floor-hall',
      name: 'Коридор 1 этажа',
      description: 'Коридор первого этажа.',
      detailedDescription: 'Первый этаж. Близко к выходу! Слева - зал со свиньями. Прямо - выходная дверь. Справа - комната охраны. В конце коридора видна тень... кто-то стоит у выхода.',
      exits: [
        { direction: 'вверх', targetLocationId: 'second-floor-hall', description: 'на второй этаж' },
        { direction: 'зал', targetLocationId: 'pig-hall', description: 'в зал со свиньями' },
        { direction: 'выход', targetLocationId: 'exit-door', description: 'к выходу', locked: true, requiredItem: 'key4' },
        { direction: 'охрана', targetLocationId: 'guard-room', description: 'в комнату охраны' },
        { direction: 'к маньяку', targetLocationId: 'maniac-encounter', description: 'к тени у двери' },
      ],
      items: [],
      npcs: [{
        id: 'maniac',
        name: 'Маньяк',
        description: 'Высокий мужчина в окровавленном фартуке. В руке - огромный нож.',
        dialogue: ['Ты не уйдешь отсюда...', 'Свеженькое мясо...', 'Я ждал тебя...']
      }],
      visited: false,
    },
    
    'maniac-encounter': {
      id: 'maniac-encounter',
      name: 'Встреча с маньяком',
      description: 'Маньяк стоит перед вами.',
      detailedDescription: 'Маньяк поворачивается к вам. Его глаза безумны. В руке - нож. Он начинает приближаться...',
      exits: [
        { direction: 'назад', targetLocationId: 'first-floor-hall', description: 'убежать' },
      ],
      items: [],
      visited: false,
    },
    
    'pig-hall': {
      id: 'pig-hall',
      name: 'Зал со свиньями',
      description: 'Большой зал с клетками.',
      detailedDescription: 'Огромный зал, полный клеток со свиньями. Они спокойны, но кажется, ждут чего-то. Воздух тяжелый. Прямо - вентиляционная шахта.',
      exits: [
        { direction: 'назад', targetLocationId: 'first-floor-hall', description: 'в коридор' },
        { direction: 'вентиляция', targetLocationId: 'vent-shaft', description: 'в вентиляцию', locked: true },
      ],
      items: [],
      visited: false,
    },
    
    'vent-shaft': {
      id: 'vent-shaft',
      name: 'Вентиляционная шахта',
      description: 'Узкая вентиляционная шахта.',
      detailedDescription: 'Тесная вентиляционная шахта. Можно пролезть внутрь. Ведет куда-то вниз...',
      exits: [
        { direction: 'назад', targetLocationId: 'pig-hall', description: 'в зал' },
        { direction: 'вниз', targetLocationId: 'basement', description: 'в подвал' },
      ],
      items: [],
      visited: false,
    },
    
    'guard-room': {
      id: 'guard-room',
      name: 'Комната охраны',
      description: 'Комната сторожа.',
      detailedDescription: 'Комната охранника. Стол с мониторами, шкаф. В шкафу что-то есть.',
      exits: [
        { direction: 'назад', targetLocationId: 'first-floor-hall', description: 'в коридор' },
      ],
      items: [
        { ...horrorItems.key3, id: 'key3-cabinet' },
      ],
      visited: false,
    },
    
    // ==================== ПОДВАЛ ====================
    'basement': {
      id: 'basement',
      name: 'Подвал',
      description: 'Темный подвал.',
      detailedDescription: 'Подвал. Сырость, плесень. Здесь холоднее. В углу - старый сейф.',
      exits: [
        { direction: 'вверх', targetLocationId: 'vent-shaft', description: 'вверх' },
        { direction: 'сейф', targetLocationId: 'safe-room', description: 'к сейфу', locked: true, requiredItem: 'key3' },
      ],
      items: [],
      visited: false,
    },
    
    'safe-room': {
      id: 'safe-room',
      name: 'Сейф',
      description: 'Комната с сейфом.',
      detailedDescription: 'За тяжелой дверью - комната с большим сейфом. В сейфе лежит что-то важное...',
      exits: [
        { direction: 'назад', targetLocationId: 'basement', description: 'в подвал' },
      ],
      items: [
        { ...horrorItems.key4, id: 'key4-safe' },
      ],
      visited: false,
    },
    
    // ==================== ВЫХОД ====================
    'exit-door': {
      id: 'exit-door',
      name: 'Выход',
      description: 'Главная дверь.',
      detailedDescription: 'Массивная металлическая дверь. Заперта на 4 замка? Нет, на один большой замок. Нужен ключ №4.',
      exits: [
        { direction: 'назад', targetLocationId: 'first-floor-hall', description: 'назад' },
        { direction: 'наружу', targetLocationId: 'freedom', description: 'на свободу!', locked: true, requiredItem: 'key4' },
      ],
      items: [],
      visited: false,
    },
    
    'freedom': {
      id: 'freedom',
      name: 'Свобода!',
      description: 'Вы сбежали!',
      detailedDescription: 'Вы выбрались наружу! Ночной воздух никогда не казался таким сладким. Позади - здание кошмаров. Вы свободны!',
      exits: [],
      items: [],
      visited: false,
    },
  };
}

// Создаем начальное состояние
export function createHorrorGameState(): HorrorGameState {
  const locations = createHorrorLocations();
  const startLocation = locations['bedroom'];
  
  return {
    currentLocationId: 'bedroom',
    inventory: [],
    visitedLocations: ['bedroom'],
    gameLog: [
      {
        type: 'system',
        text: '🌙 ПРОБУЖДЕНИЕ\n\nВы очнулись на кровати в темноте. Что вы будете делать? Третий этаж. Неизвестное здание. Вокруг - стены и тишина.',
        timestamp: Date.now(),
      },
      {
        type: 'system',
        text: '💡 Подсказки:\n• Найдите выключатель или дождитесь утра (спите)\n• Соберите 4 ключа чтобы выбраться\n• Используйте "смешать" для создания предметов\n• Готовьте еду чтобы выжить',
        timestamp: Date.now(),
      },
      {
        type: 'location',
        text: `**${startLocation.name}**\n\n${startLocation.detailedDescription}\n\n*Темнота окружает вас. Нужен свет...*\n\n**Выходы:**\n• дверь (в коридор)\n• балкон`,
        timestamp: Date.now(),
      }
    ],
    flags: {},
    turn: 0,
    isDark: true,
    isDaytime: false,
    sleepCount: 0,
    hasLight: false,
    discoveredConnections: [],
    previousLocationId: null,
    craftedItems: [],
    cookedMeals: [],
    unlockedDoors: [],
    // Маньяк
    maniacLocation: 'first-floor-hall',  // Маньяк начинает на 1 этаже
    maniacAsleep: false,
    maniacTurnedToPig: false,
    maniacFed: false,
    // Концовка
    ending: null,
    gameOver: false,
  };
}

// Карта мира
export interface MapNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'room' | 'secret' | 'exit' | 'danger' | 'start' | 'vent';
}

export const horrorWorldMap: MapNode[] = [
  // Третий этаж
  { id: 'bedroom', x: 50, y: 15, label: 'Спальня', type: 'room' },
  { id: 'balcony', x: 65, y: 15, label: 'Балкон', type: 'room' },
  { id: 'balcony-jump', x: 65, y: 5, label: 'Падение', type: 'danger' },
  { id: 'fire-escape', x: 75, y: 25, label: 'Лестн.', type: 'room' },
  { id: 'third-floor-hall', x: 50, y: 25, label: 'Коридор 3', type: 'room' },
  { id: 'bathroom', x: 35, y: 25, label: 'Ванная', type: 'room' },
  { id: 'kitchen', x: 50, y: 35, label: 'Кухня', type: 'room' },
  { id: 'pantry', x: 35, y: 35, label: 'Кладовка', type: 'secret' },
  
  // Второй этаж
  { id: 'second-floor-hall', x: 50, y: 50, label: 'Коридор 2', type: 'room' },
  { id: 'shredder-room', x: 35, y: 50, label: 'Шредер', type: 'danger' },
  { id: 'shredder-death', x: 35, y: 40, label: 'МЯСО', type: 'danger' },
  { id: 'laundry', x: 65, y: 50, label: 'Прачка', type: 'room' },
  { id: 'second-balcony', x: 75, y: 45, label: 'Балкон 2', type: 'room' },
  
  // Первый этаж
  { id: 'first-floor-hall', x: 50, y: 65, label: 'Коридор 1', type: 'room' },
  { id: 'maniac-encounter', x: 60, y: 60, label: 'Маньяк', type: 'danger' },
  { id: 'pig-hall', x: 35, y: 65, label: 'Свиньи', type: 'danger' },
  { id: 'guard-room', x: 65, y: 65, label: 'Охрана', type: 'room' },
  { id: 'vent-shaft', x: 35, y: 75, label: 'Вент.', type: 'room' },
  
  // Подвал
  { id: 'basement', x: 35, y: 85, label: 'Подвал', type: 'room' },
  { id: 'safe-room', x: 25, y: 85, label: 'Сейф', type: 'secret' },
  
  // Выход
  { id: 'exit-door', x: 50, y: 80, label: 'Дверь', type: 'exit' },
  { id: 'freedom', x: 50, y: 95, label: 'СВОБОДА', type: 'exit' },
];
