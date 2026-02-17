// Система достижений

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  secret?: boolean; // Секретные ачивки скрыты до получения
  unlocked: boolean;
  unlockedAt?: number;
}

// Начальный список достижений
export const initialAchievements: Achievement[] = [
  // Достижения за концовки
  {
    id: 'ending_frozen',
    name: 'Замороженное мясо',
    description: 'Прыгнуть с балкона и замерзнуть',
    icon: '❄️',
    unlocked: false,
  },
  {
    id: 'ending_caught',
    name: 'Коллекционный экземпляр',
    description: 'Попасться маньяку',
    icon: '🔪',
    unlocked: false,
  },
  {
    id: 'ending_shredder',
    name: 'Фаршированный',
    description: 'Упасть в шредер',
    icon: '🥩',
    unlocked: false,
  },
  {
    id: 'ending_forgot',
    name: 'Забывчивый',
    description: 'Сбежать без превращения маньяка',
    icon: '🤦',
    unlocked: false,
  },
  {
    id: 'ending_eaten',
    name: 'Ужин для свиньи',
    description: 'Быть съеденным свиньей-маньяком',
    icon: '🐷',
    unlocked: false,
  },
  {
    id: 'ending_chase',
    name: 'Марафонец',
    description: 'Превратить маньяка, но не усыпить',
    icon: '🏃',
    unlocked: false,
  },
  {
    id: 'ending_true',
    name: 'Свобода!',
    description: 'Совершить правильный побег',
    icon: '🎉',
    unlocked: false,
  },
  
  // Исследование
  {
    id: 'explorer_10',
    name: 'Исследователь',
    description: 'Посетить 10 локаций',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'explorer_all',
    name: 'Картограф',
    description: 'Посетить все локации',
    icon: '🧭',
    unlocked: false,
  },
  {
    id: 'key_master',
    name: 'Ключник',
    description: 'Собрать все 4 ключа',
    icon: '🔑',
    unlocked: false,
  },
  {
    id: 'sleepy_head',
    name: 'Соня',
    description: 'Поспать 3 раза',
    icon: '💤',
    unlocked: false,
  },
  {
    id: 'light_bringer',
    name: 'Светоч',
    description: 'Включить свет выключателем',
    icon: '💡',
    unlocked: false,
  },
  
  // Секретные и забавные
  {
    id: 'obedient_prisoner',
    name: 'Послушный пленный',
    description: 'Простоять в спальне 10 ходов, никуда не ходя',
    icon: '😇',
    secret: true,
    unlocked: false,
  },
  {
    id: 'raw_chicken_eater',
    name: 'Сыроед',
    description: 'Попытаться съесть сырую курицу',
    icon: '🤢',
    secret: true,
    unlocked: false,
  },
  {
    id: 'shredder_tester',
    name: 'Акробат',
    description: 'Залезть в шредер и выжить (отмена)',
    icon: '🤸',
    secret: true,
    unlocked: false,
  },
  {
    id: 'maniac_friend',
    name: 'Дружелюбный',
    description: 'Попытаться поговорить с маньяком',
    icon: '👋',
    secret: true,
    unlocked: false,
  },
  {
    id: 'pig_whisperer',
    name: 'Свинопас',
    description: 'Провести 5 ходов в зале со свиньями',
    icon: '🐽',
    unlocked: false,
  },
  {
    id: 'chef_master',
    name: 'Шеф-повар',
    description: 'Приготовить курицу-гриль',
    icon: '👨‍🍳',
    unlocked: false,
  },
  {
    id: 'mad_scientist',
    name: 'Безумный ученый',
    description: 'Создать смесь инъекций',
    icon: '🧪',
    unlocked: false,
  },
  {
    id: 'jumper',
    name: 'Прыгун',
    description: 'Подойти к краю балкона и передумать',
    icon: '🦘',
    secret: true,
    unlocked: false,
  },
  {
    id: 'collector',
    name: 'Коллекционер',
    description: 'Собрать 10 предметов в инвентаре',
    icon: '🎒',
    unlocked: false,
  },
  {
    id: 'speedrunner',
    name: 'Спидраннер',
    description: 'Победить менее чем за 30 ходов',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'completionist',
    name: 'Идеалист',
    description: 'Получить все остальные достижения (кроме этого)',
    icon: '🏆',
    unlocked: false,
  },
];

// Функция для проверки и разблокировки достижений
export function checkAchievements(
  gameState: any,
  locations: any,
  action: string,
  currentAchievements: Achievement[]
): { newAchievements: Achievement[]; unlocked: Achievement[] } {
  const newAchievements = [...currentAchievements];
  const unlocked: Achievement[] = [];
  
  const unlockAchievement = (id: string) => {
    const achievement = newAchievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      unlocked.push(achievement);
    }
  };
  
  // Проверка концовок
  if (gameState.ending) {
    switch (gameState.ending) {
      case 'frozen_jump': unlockAchievement('ending_frozen'); break;
      case 'caught_manac': unlockAchievement('ending_caught'); break;
      case 'shredder_meat': unlockAchievement('ending_shredder'); break;
      case 'forgot_potion': unlockAchievement('ending_forgot'); break;
      case 'eaten_by_pig': unlockAchievement('ending_eaten'); break;
      case 'pig_chase': unlockAchievement('ending_chase'); break;
      case 'true_escape': unlockAchievement('ending_true'); break;
    }
  }
  
  // Исследование
  if (gameState.visitedLocations.length >= 10) {
    unlockAchievement('explorer_10');
  }
  if (gameState.visitedLocations.length >= 17) { // Всего 17 локаций
    unlockAchievement('explorer_all');
  }
  
  // Ключи
  const keyCount = gameState.inventory.filter((i: any) => i.id.includes('key')).length;
  if (keyCount >= 4) {
    unlockAchievement('key_master');
  }
  
  // Сон
  if (gameState.sleepCount >= 3) {
    unlockAchievement('sleepy_head');
  }
  
  // Свет
  if (gameState.hasLight && action === 'turn_on_light') {
    unlockAchievement('light_bringer');
  }
  
  // Кулинария
  if (gameState.cookedMeals.length > 0) {
    unlockAchievement('chef_master');
  }
  
  // Крафт
  if (gameState.craftedItems.length > 0) {
    unlockAchievement('mad_scientist');
  }
  
  // Коллекционер
  if (gameState.inventory.length >= 10) {
    unlockAchievement('collector');
  }
  
  // Спидран
  if (gameState.turn <= 30 && gameState.ending === 'true_escape') {
    unlockAchievement('speedrunner');
  }
  
  // Проверка на идеалиста (все достижения КРОМЕ самого идеалиста)
  const unlockedCount = newAchievements.filter(a => a.unlocked && a.id !== 'completionist').length;
  const totalWithoutCompletionist = newAchievements.length - 1;
  if (unlockedCount >= totalWithoutCompletionist) {
    unlockAchievement('completionist');
  }
  
  return { newAchievements, unlocked };
}

// Проверка секретных действий
export function checkSecretAction(
  action: string,
  gameState: any,
  currentAchievements: Achievement[]
): { newAchievements: Achievement[]; unlocked: Achievement[] } {
  const newAchievements = [...currentAchievements];
  const unlocked: Achievement[] = [];
  
  const unlockAchievement = (id: string) => {
    const achievement = newAchievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      unlocked.push(achievement);
    }
  };
  
  switch (action) {
    case 'eat_raw_chicken':
      unlockAchievement('raw_chicken_eater');
      break;
    case 'approach_edge':
      unlockAchievement('jumper');
      break;
    case 'talk_to_maniac':
      unlockAchievement('maniac_friend');
      break;
    case 'stay_in_bedroom':
      if (gameState.turn >= 10 && gameState.visitedLocations.length === 1) {
        unlockAchievement('obedient_prisoner');
      }
      break;
    case 'pig_hall_time':
      // Нужно отслеживать отдельно
      break;
  }
  
  return { newAchievements, unlocked };
}

// Сохранение и загрузка достижений
export function saveAchievements(achievements: Achievement[]) {
  localStorage.setItem('horror-achievements', JSON.stringify(achievements));
}

export function loadAchievements(): Achievement[] {
  const saved = localStorage.getItem('horror-achievements');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load achievements:', e);
    }
  }
  return initialAchievements;
}

// Сброс достижений
export function resetAchievements(): Achievement[] {
  localStorage.removeItem('horror-achievements');
  return initialAchievements.map(a => ({ ...a, unlocked: false, unlockedAt: undefined }));
}
