"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWhatIfScenario = generateWhatIfScenario;
exports.generateWithAlternativeModel = generateWithAlternativeModel;
const inference_1 = require("@huggingface/inference");
// Создаем экземпляр Hugging Face Inference
// Используем API ключ из переменных окружения, если доступен
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || '';
const hf = HUGGING_FACE_API_KEY ? new inference_1.HfInference(HUGGING_FACE_API_KEY) : new inference_1.HfInference();
// Конфигурация для различных AI моделей
const AI_MODELS = {
    huggingface: {
        model: 'microsoft/DialoGPT-medium',
        fallback: 'gpt2'
    },
    local: {
        enabled: true,
        creative: true
    }
};
async function generateWhatIfScenario(request) {
    try {
        // Пробуем использовать Hugging Face API
        console.log('Using Hugging Face API');
        const hfScenario = await generateWithHuggingFace(request);
        if (hfScenario) {
            console.log(`HF Generation completed, length: ${hfScenario.length} characters`);
            return {
                scenario: hfScenario,
                success: true
            };
        }
        // Если Hugging Face не сработал, используем локальный генератор как запасной вариант
        console.log('Using local creative generator as fallback');
        const scenario = generateCreativeScenario(request);
        console.log(`Local generation completed, length: ${scenario.length} characters`);
        return {
            scenario,
            success: true
        };
    }
    catch (error) {
        console.error('AI Service Error:', error);
        // В случае ошибки возвращаем запасной сценарий
        return {
            scenario: generateFallbackScenario(request),
            success: false,
            error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        };
    }
}
// Функция для генерации сценария через Hugging Face API
async function generateWithHuggingFace(request) {
    try {
        // Формируем промпт для нейросети
        const prompt = createPromptForAI(request);
        // Пробуем использовать text generation API
        const response = await hf.textGeneration({
            model: AI_MODELS.huggingface.model,
            inputs: prompt,
            parameters: {
                max_new_tokens: 1500,
                temperature: 0.9,
                top_p: 0.95,
                repetition_penalty: 1.2,
                do_sample: true,
                return_full_text: false
            }
        });
        if (response && response.generated_text) {
            return formatAIResponse(response.generated_text, request);
        }
        return null;
    }
    catch (error) {
        console.warn('Hugging Face generation failed:', error);
        // Пробуем альтернативную модель
        try {
            const fallbackResponse = await hf.textGeneration({
                model: AI_MODELS.huggingface.fallback,
                inputs: createSimplePrompt(request),
                parameters: {
                    max_new_tokens: 800,
                    temperature: 0.8,
                    top_p: 0.9,
                    repetition_penalty: 1.1
                }
            });
            if (fallbackResponse && fallbackResponse.generated_text) {
                return formatAIResponse(fallbackResponse.generated_text, request);
            }
        }
        catch (fallbackError) {
            console.warn('Fallback model also failed:', fallbackError);
        }
        return null;
    }
}
// Создание промпта для AI модели
function createPromptForAI(request) {
    return `Ты - профессиональный писатель и сценарист, специализирующийся на создании альтернативных сценариев историй. Твоя задача - создать увлекательный и детализированный рассказ на русском языке.

Исходная история: "${request.story}"

Вопрос "что если": "${request.whatIfQuestion}"

Требования к альтернативному сценарию:
1. Создай структурированный рассказ с четким началом, развитием событий, кульминацией и развязкой
2. Используй художественные приемы: диалоги, описания эмоций персонажей, детали окружения
3. Сделай сюжет логически связанным с исходной историей, но с неожиданными поворотами
4. Добавь глубину персонажам, покажи их развитие и внутренние конфликты
5. Используй живой, увлекательный язык, избегай шаблонных фраз
6. Объем текста должен быть не менее 800 слов
7. Пиши на русском языке, используя богатую лексику и разнообразные грамматические конструкции

Альтернативный сценарий:`;
}
// Упрощенный промпт для fallback модели
function createSimplePrompt(request) {
    return `История: ${request.story}\n\nЧто если ${request.whatIfQuestion}?\n\nАльтернативный сценарий:`;
}
// Форматирование ответа от AI
function formatAIResponse(aiText, request) {
    // Очищаем и форматируем ответ
    let formatted = aiText
        .trim()
        .replace(/^(Альтернативный сценарий:|Сценарий:|История:)/i, '')
        .trim();
    // Добавляем заголовок если его нет
    if (!formatted.includes('#')) {
        formatted = `# Альтернативный сценарий\n\n${formatted}`;
    }
    // Если текст слишком короткий, дополняем его
    if (formatted.length < 500) {
        const additionalContent = generateCreativeEnding(request);
        formatted += `\n\n${additionalContent}`;
    }
    // Улучшаем структуру текста
    formatted = improveTextStructure(formatted);
    return formatted;
}
// Улучшение структуры текста
function improveTextStructure(text) {
    // Добавляем разрывы между абзацами
    text = text.replace(/\n{2,}/g, '\n\n');
    // Улучшаем заголовки
    text = text.replace(/^(#+)(.*?)(\n|$)/gm, '$1$2$3\n');
    // Добавляем эмотивность в текст
    return text;
}
// Генерация креативного окончания для коротких ответов AI
function generateCreativeEnding(request) {
    return `Таким образом, если бы ${request.whatIfQuestion.toLowerCase()}, это привело бы к удивительной цепи событий, где каждое действие порождает новые возможности и неожиданные повороты судьбы. Жизнь превратилась бы в захватывающее приключение, полное смысла и глубоких эмоциональных переживаний.`;
}
// Креативный генератор детализированных сценариев
function generateCreativeScenario(request) {
    // Анализируем историю более глубоко
    const storyAnalysis = analyzeStoryDeep(request.story);
    const conditionalAnalysis = analyzeConditionalQuestion(request.whatIfQuestion);
    // Создаем элементы для обратной совместимости
    const storyElements = {
        characters: extractCharacters(request.story),
        setting: extractSetting(request.story),
        emotions: extractEmotions(request.story),
        mainAction: extractMainAction(request.story)
    };
    const whatIfElements = {
        condition: request.whatIfQuestion.replace(/^(что\s+было\s+бы,?\s*если|что\s+если|а\s+что\s+если)/i, '').trim(),
        consequence: generateConsequenceFromCondition(request.whatIfQuestion)
    };
    // Создаем полноценный альтернативный сценарий
    const detailedStory = generateAdvancedScenario(storyElements, whatIfElements, storyAnalysis, conditionalAnalysis, request);
    return detailedStory;
}
// Улучшенный генератор альтернативных сценариев
function generateAdvancedScenario(storyElements, whatIfElements, storyAnalysis, conditionalAnalysis, request) {
    // Определяем тип альтернативы на основе анализа
    const scenarioType = determineScenarioType(storyAnalysis, conditionalAnalysis);
    console.log(`Генерируем сценарий типа: ${scenarioType}`);
    // Генерируем контент в зависимости от типа сценария
    switch (scenarioType) {
        case 'dramatic_reversal':
            return generateDramaticReversalScenario(storyElements, whatIfElements, storyAnalysis, request);
        case 'character_growth':
            return generateCharacterGrowthScenario(storyElements, whatIfElements, storyAnalysis, request);
        case 'butterfly_effect':
            return generateButterflyEffectScenario(storyElements, whatIfElements, storyAnalysis, request);
        case 'relationship_change':
            return generateRelationshipChangeScenario(storyElements, whatIfElements, storyAnalysis, request);
        case 'opportunity_seized':
            return generateOpportunityScenario(storyElements, whatIfElements, storyAnalysis, request);
        default:
            return generateMultiLayeredScenario(storyElements, whatIfElements, storyAnalysis, conditionalAnalysis, request);
    }
}
// Генерация заголовка истории
function generateStoryTitle(whatIfElements) {
    const titles = [
        `"Если бы ${whatIfElements.condition}...": История альтернативных возможностей`,
        `"Поворот судьбы": Что произошло бы, если ${whatIfElements.condition}`,
        `"Другая реальность": Мир, где ${whatIfElements.condition}`,
        `"Бабочка и ураган": Как ${whatIfElements.condition} изменило всё`,
        `"Альтернативный путь": История о том, что случилось бы, если ${whatIfElements.condition}`
    ];
    return titles[Math.floor(Math.random() * titles.length)];
}
// Детализированное введение
function generateDetailedIntroduction(storyElements, whatIfElements) {
    const introductions = [
        `В параллельной вселенности, где ${whatIfElements.condition}, мир выглядел совершенно по-другому. ${storyElements.setting} было пропитано особой атмосферой предчувствий и неизведанных возможностей.

${storyElements.characters} проснулись в тот день, не подозревая, что их жизнь вот-вот кардинально изменится. Воздух словно наэлектризовался от грядущих перемен. Каждая деталь окружающего мира приобрела новый смысл, каждый взгляд, каждое слово теперь имели особое значение.

В этой альтернативной реальности даже самые обыденные вещи становились источником удивительных открытий. ${whatIfElements.consequence} уже витало в воздухе, готовое проявиться в самый неожиданный момент.`,
        `Представьте себе мир, где ${whatIfElements.condition} стало реальностью. В этой альтернативной временной линии ${storyElements.characters} оказались участниками совершенно иной истории.

${storyElements.setting} преобразилось до неузнаваемости. Привычные правила больше не действовали, открывая простор для невероятных возможностей. Каждый шаг, каждое решение теперь могло привести к результатам, которые в обычном мире показались бы фантастическими.

В воздухе ощущалось присутствие чего-то магического, что-то, что превращало обыденную жизнь в захватывающее приключение. ${storyElements.emotions} приобрели новую глубину и интенсивность.`,
        `История началась с того момента, когда ${whatIfElements.condition} изменило весь ход событий. Это был тот самый "эффект бабочки", когда малейшее изменение в начальных условиях привело к грандиозным последствиям.

${storyElements.characters} внезапно обнаружили себя в мире безграничных возможностей. ${storyElements.setting} стало не просто местом действия, а живым организмом, реагирующим на каждое их движение, каждую мысль.

Время словно замедлилось, позволяя в полной мере ощутить значимость каждого момента. ${storyElements.mainAction} приобрело эпический размах, превратившись из простого события в судьбоносное приключение.`
    ];
    return introductions[Math.floor(Math.random() * introductions.length)];
}
// Развитие сюжета с несколькими главами
function generateStoryDevelopment(storyElements, whatIfElements, request) {
    const chapter1 = generateChapter1(storyElements, whatIfElements);
    const chapter2 = generateChapter2(storyElements, whatIfElements);
    const chapter3 = generateChapter3(storyElements, whatIfElements, request);
    return `### Глава 1: Начало перемен

${chapter1}

### Глава 2: Углубление в новую реальность

${chapter2}

### Глава 3: Неожиданные открытия

${chapter3}`;
}
function generateChapter1(storyElements, whatIfElements) {
    const chapters = [
        `Первые признаки изменений проявились незаметно. ${storyElements.characters} заметили, что ${storyElements.setting} начало приобретать новые оттенки и нюансы. То, что раньше казалось привычным и понятным, теперь таило в себе загадки и неожиданные повороты.

Постепенно становилось ясно, что ${whatIfElements.condition} запустило цепную реакцию событий. Каждый день приносил новые сюрпризы, каждое взаимодействие открывало неизведанные грани отношений между людьми.

Атмосфера была пропитана предвкушением. ${storyElements.emotions} усиливались с каждым часом, создавая ощущение, что жизнь наконец-то обрела истинный смысл и направление.`,
        `В первые дни после того, как ${whatIfElements.condition} стало реальностью, мир казался одновременно знакомым и совершенно чужим. ${storyElements.characters} обнаружили, что их восприятие действительности кардинально изменилось.

Привычные рутины и ритуалы приобрели новое значение. ${storyElements.setting} превратилось в театр, где каждый день разыгрывались новые акты удивительной драмы. Люди, которых они знали всю жизнь, внезапно открылись с неожиданных сторон.

${whatIfElements.consequence} проявлялось во всех аспектах жизни, от самых мелких деталей до глобальных изменений в мировоззрении.`,
        `Изменения начались с малого, но их влияние росло как снежный ком. ${storyElements.characters} почувствовали, что стоят на пороге чего-то грандиозного. Каждый разговор, каждая встреча теперь несли в себе потенциал для невероятных открытий.

${storyElements.mainAction} приобрело совершенно новые измерения. То, что в обычной реальности было бы простым взаимодействием, здесь превратилось в многослойный танец возможностей и судьбоносных решений.

Мир вокруг них пульсировал новой энергией, словно проснувшись от долгого сна.`
    ];
    return chapters[Math.floor(Math.random() * chapters.length)];
}
function generateChapter2(storyElements, whatIfElements) {
    const chapters = [
        `По мере углубления в эту новую реальность, ${storyElements.characters} начали понимать истинный масштаб произошедших изменений. ${whatIfElements.condition} оказалось лишь верхушкой айсберга грандиозной трансформации.

Каждый день приносил новые откровения. Люди, с которыми они взаимодействовали, раскрывались как многогранные личности с удивительными историями и скрытыми талантами. ${storyElements.setting} стало живой экосистемой, где каждый элемент играл важную роль в общей симфонии жизни.

Постепенно выстраивалась новая картина мира, где ${whatIfElements.consequence} стало не просто событием, а философией существования. ${storyElements.emotions} достигли такой глубины, которую раньше было невозможно представить.`,
        `Вторая фаза трансформации принесла с собой глубокие внутренние изменения. ${storyElements.characters} обнаружили в себе способности и качества, о существовании которых даже не подозревали.

Окружающий мир отвечал на их внутренние изменения, создавая синхронии и совпадения, которые в обычной жизни показались бы невероятными. ${storyElements.setting} стало зеркалом их души, отражая каждый нюанс их эмоционального состояния.

Взаимоотношения с другими людьми достигли невиданной глубины. Каждый разговор становился возможностью для взаимного роста и понимания. ${whatIfElements.condition} открыло двери в мир, где аутентичность и искренность стали нормой жизни.`,
        `На этом этапе стало ясно, что ${whatIfElements.condition} было лишь катализатором для пробуждения дремавших в мире возможностей. ${storyElements.characters} оказались в центре удивительной сети взаимосвязей и синхронностей.

Реальность приобрела текучесть и пластичность. Границы между возможным и невозможным стали размытыми. ${storyElements.mainAction} развилось в сложную многоуровневую историю, где каждый поворот сюжета открывал новые горизонты.

Все вокруг дышало творчеством и бесконечными возможностями. Жизнь превратилась в произведение искусства, где каждый день был новой страницей захватывающего романа.`
    ];
    return chapters[Math.floor(Math.random() * chapters.length)];
}
function generateChapter3(storyElements, whatIfElements, request) {
    const chapters = [
        `Третья глава этой удивительной истории принесла самые неожиданные повороты. ${storyElements.characters} достигли точки, где прошлое, настоящее и будущее слились в единый поток возможностей.

Оказалось, что ${whatIfElements.condition} было предназначено случиться именно в этот момент, именно с этими людьми, именно в этом месте. Все предыдущие события жизни внезапно обрели смысл, как кусочки мозаики, складывающиеся в прекрасную картину.

${storyElements.setting} трансформировалось в пространство чистой магии, где мысли материализовались, а мечты становились реальностью. Каждый шаг открывал новые измерения существования, каждое дыхание приносило инсайты и откровения.

В этой фазе истории границы между внутренним и внешним миром полностью растворились.`,
        `Кульминационная часть развития событий принесла понимание того, что ${whatIfElements.condition} было лишь началом невероятного путешествия трансформации. ${storyElements.characters} обнаружили, что стали проводниками изменений не только в своей жизни, но и в жизни всех, кто их окружал.

Синхронности стали происходить с такой частотой, что реальность приобрела сказочный характер. ${storyElements.emotions} достигли такой интенсивности и чистоты, что каждое переживание становилось откровением.

Мир вокруг них пульсировал энергией творчества и любви. Каждая встреча, каждый разговор, каждый момент созерцания приносили новые слои понимания и мудрости.

Постепенно стало ясно, что они участвуют в чем-то гораздо большем, чем личная история.`,
        `В этой главе истории ${storyElements.characters} поняли, что стали частью грандиозного эксперимента вселенной. ${whatIfElements.condition} оказалось порталом в реальность, где законы причины и следствия работают по принципам высшей гармонии.

Их жизнь превратилась в живое произведение искусства, где каждый день был новой главой эпического романа. ${storyElements.setting} стало декорацией для величайшего шоу на земле - шоу человеческого потенциала, раскрывающегося во всей своей красе.

Открытия следовали одно за другим с головокружительной скоростью. Каждое мгновение приносило новые уровни понимания себя, других людей и природы реальности.

Мир стал учебником по жизни, где каждая страница содержала уроки мудрости и красоты.`
    ];
    return chapters[Math.floor(Math.random() * chapters.length)];
}
// Глубокий анализ истории
function analyzeStoryDeep(story) {
    const themes = extractThemes(story);
    const emotionalTone = analyzeEmotionalTone(story);
    const keyElements = extractKeyStoryElements(story);
    const conflictType = identifyConflictType(story);
    const storyContext = identifyContext(story);
    return {
        themes,
        emotionalTone,
        keyElements,
        conflictType,
        storyContext,
        complexity: story.length > 200 ? 'high' : story.length > 100 ? 'medium' : 'low'
    };
}
// Анализ условного вопроса
function analyzeConditionalQuestion(question) {
    const changeType = identifyChangeType(question);
    const scope = identifyChangeScope(question);
    const urgency = identifyUrgency(question);
    return {
        changeType,
        scope,
        urgency,
        isEmotional: /чувств|эмоци|любов|счаст|грус/.test(question.toLowerCase()),
        isPractical: /работ|деньг|бизнес|карьер|учеб/.test(question.toLowerCase()),
        isRelational: /друг|семь|отношени|встреч/.test(question.toLowerCase())
    };
}
// Определение типа сценария
function determineScenarioType(storyAnalysis, conditionalAnalysis) {
    if (conditionalAnalysis.changeType === 'reversal')
        return 'dramatic_reversal';
    if (conditionalAnalysis.isRelational)
        return 'relationship_change';
    if (conditionalAnalysis.isPractical)
        return 'opportunity_seized';
    if (storyAnalysis.conflictType === 'internal')
        return 'character_growth';
    if (conditionalAnalysis.scope === 'major')
        return 'butterfly_effect';
    return 'multi_layered';
}
// Извлечение тем из истории
function extractThemes(story) {
    const themes = [];
    const lowerStory = story.toLowerCase();
    if (/любов|романт|чувств|сердц/.test(lowerStory))
        themes.push('любовь');
    if (/работ|карьер|бизнес|проект/.test(lowerStory))
        themes.push('карьера');
    if (/друж|друг|товарищ/.test(lowerStory))
        themes.push('дружба');
    if (/семь|родител|дет/.test(lowerStory))
        themes.push('семья');
    if (/мечт|цел|стремлени/.test(lowerStory))
        themes.push('мечты');
    if (/выбор|решени|дилемм/.test(lowerStory))
        themes.push('выбор');
    if (/прошл|воспоминани|истори/.test(lowerStory))
        themes.push('прошлое');
    if (/будущ|планы|надежд/.test(lowerStory))
        themes.push('будущее');
    return themes.length > 0 ? themes : ['жизненный путь'];
}
// Анализ эмоционального тона
function analyzeEmotionalTone(story) {
    const lowerStory = story.toLowerCase();
    const positive = /радост|счастлив|веселы|довольн|восторг|любов/.test(lowerStory);
    const negative = /грустн|печаль|расстрое|злост|обид|больн/.test(lowerStory);
    const neutral = /встрет|работ|обычн|простой|норм/.test(lowerStory);
    const nostalgic = /вспомин|прошл|давн|когда-то/.test(lowerStory);
    const hopeful = /надеж|мечт|верю|возможност/.test(lowerStory);
    if (nostalgic)
        return 'nostalgic';
    if (hopeful)
        return 'hopeful';
    if (positive && negative)
        return 'complex';
    if (positive)
        return 'positive';
    if (negative)
        return 'melancholic';
    return 'neutral';
}
// Извлечение ключевых элементов истории
function extractKeyStoryElements(story) {
    const relationships = extractRelationships(story);
    const locations = extractLocations(story);
    const timeframe = extractTimeframe(story);
    const actions = extractMainActions(story);
    return { relationships, locations, timeframe, actions };
}
// Определение типа конфликта
function identifyConflictType(story) {
    const lowerStory = story.toLowerCase();
    if (/выбор|решени|дилемм|не знал/.test(lowerStory))
        return 'internal';
    if (/спор|конфликт|ссор|против/.test(lowerStory))
        return 'interpersonal';
    if (/работ|босс|коллег|начальник/.test(lowerStory))
        return 'professional';
    if (/семь|родител|отношени/.test(lowerStory))
        return 'family';
    return 'circumstantial';
}
// Определение контекста истории
function identifyContext(story) {
    const lowerStory = story.toLowerCase();
    if (/работ|офис|проект|карьер/.test(lowerStory))
        return 'professional';
    if (/дом|семь|родител/.test(lowerStory))
        return 'family';
    if (/школ|универ|учеб|студент/.test(lowerStory))
        return 'educational';
    if (/друзь|компани|встреч/.test(lowerStory))
        return 'social';
    if (/путешеств|поездк|отпуск/.test(lowerStory))
        return 'travel';
    return 'personal';
}
// Определение типа изменения в вопросе
function identifyChangeType(question) {
    const lowerQuestion = question.toLowerCase();
    if (/не |не бы|отказ|против/.test(lowerQuestion))
        return 'reversal';
    if (/другой|иной|альтернатив/.test(lowerQuestion))
        return 'alternative';
    if (/смел|решил|рискн/.test(lowerQuestion))
        return 'bold_action';
    if (/сказал|признал|открыл/.test(lowerQuestion))
        return 'confession';
    if (/встрет|познаком/.test(lowerQuestion))
        return 'encounter';
    return 'general_change';
}
// Определение масштаба изменения
function identifyChangeScope(question) {
    const lowerQuestion = question.toLowerCase();
    if (/жизн|судьб|всё|кардинальн/.test(lowerQuestion))
        return 'major';
    if (/отношени|семь|работ/.test(lowerQuestion))
        return 'significant';
    return 'moderate';
}
// Определение срочности
function identifyUrgency(question) {
    const lowerQuestion = question.toLowerCase();
    if (/сейчас|немедленн|срочн|тотчас/.test(lowerQuestion))
        return 'immediate';
    if (/скор|быстр|поскорее/.test(lowerQuestion))
        return 'urgent';
    return 'normal';
}
// Генераторы конкретных типов сценариев
function generateDramaticReversalScenario(storyElements, whatIfElements, storyAnalysis, request) {
    const title = `Поворот на 180°: Альтернативная реальность`;
    const content = generateReversalContent(storyAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
function generateCharacterGrowthScenario(storyElements, whatIfElements, storyAnalysis, request) {
    const title = `Путь развития: Как изменился бы характер`;
    const content = generateGrowthContent(storyAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
function generateButterflyEffectScenario(storyElements, whatIfElements, storyAnalysis, request) {
    const title = `Эффект бабочки: Малые причины - большие следствия`;
    const content = generateButterflyContent(storyAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
function generateRelationshipChangeScenario(storyElements, whatIfElements, storyAnalysis, request) {
    const title = `Новая динамика отношений`;
    const content = generateRelationshipContent(storyAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
function generateOpportunityScenario(storyElements, whatIfElements, storyAnalysis, request) {
    const title = `Упущенная возможность: Альтернативный путь`;
    const content = generateOpportunityContent(storyAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
function generateMultiLayeredScenario(storyElements, whatIfElements, storyAnalysis, conditionalAnalysis, request) {
    const title = `Многогранная альтернатива`;
    const content = generateComplexContent(storyAnalysis, conditionalAnalysis, whatIfElements, request);
    return `# ${title}\n\n${content}`;
}
// Остальные функции для работы AI сервиса
function generateReversalContent(storyAnalysis, whatIfElements, request) {
    const consequences = [
        'неожиданные союзы и дружба зародились бы',
        'жизненные приоритеты полностью пересмотрелись бы',
        'новые горизонты открылись бы для всех участников',
        'привычный мир трансформировался бы в нечто удивительное',
        'скрытые возможности стали бы реальностью'
    ];
    const consequence = consequences[Math.floor(Math.random() * consequences.length)];
    return `В этом альтернативном сценарии события принимают кардинально противоположное направление. Если бы ${whatIfElements.condition}, вся динамика истории изменилась бы коренным образом.\n\nВместо привычного развития событий, главные герои оказались бы перед совершенно иными вызовами и возможностями. Это повлекло бы за собой цепочку неожиданных последствий, каждое из которых открыло бы новые горизонты и перспективы.\n\nКульминация этого сценария произошла бы в самый неожиданный момент, когда герои поняли бы, что ${consequence}. В этот критический момент они столкнулись бы с выбором, который определил бы не только их собственное будущее, но и судьбы всех, кто их окружал.\n\nВ итоге этот кардинально иной путь привёл бы к созданию совершенно новой реальности, где каждый элемент жизни обрёл бы новое значение и смысл. Герои обнаружили бы в себе силы, о которых даже не подозревали, и научились бы видеть возможности там, где раньше видели только препятствия.`;
}
function generateGrowthContent(storyAnalysis, whatIfElements, request) {
    const outcomes = [
        'глубоким пониманием ценности каждого момента',
        'осознанием того, что жизнь полна неожиданных возможностей',
        'пониманием силы человеческих связей и взаимопонимания',
        'осознанием важности смелых решений',
        'глубокой благодарностью за жизненные повороты'
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    return `В этом сценарии ${whatIfElements.condition} становится катализатором глубокого личностного роста. Главные герои обнаруживают в себе силы и качества, о которых даже не подозревали.\n\nКаждое испытание становится возможностью для развития, каждый выбор - шагом к лучшей версии себя. Постепенно они начинают смотреть на мир с новой мудростью и пониманием. В самые трудные моменты они находят в себе внутренние ресурсы, которые раньше считали недоступными.\n\nРазвитие событий напоминает захватывающий роман: каждый день приносит новые открытия, каждое решение открывает неизведанные пути. Герои учатся доверять своей интуиции и принимать неопределенность как часть приключения.\n\nИстория завершается триумфом человеческого духа - герои не только преодолевают внешние препятствия, но и обретают внутреннюю свободу и гармонию. Этот путь приводит их к ${outcome}.`;
}
// Остальные функции с аналогичной структурой
function generateButterflyContent(storyAnalysis, whatIfElements, request) {
    const scenarios = [
        'Развитие событий напоминало бы захватывающий роман: каждый день приносил бы новые открытия, каждое решение открывало бы неизведанные пути.',
        'История превратилась бы в калейдоскоп возможностей, где каждый поворот событий раскрывал бы новые грани характеров и отношений.',
        'Словно в увлекательном фильме, сюжет развивался бы стремительно, не давая участникам и момента для скуки.'
    ];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    return `Маленькое изменение - ${whatIfElements.condition} - запускает невероятную цепочку событий. Как камень, брошенный в спокойную воду, это решение создаёт концентрические круги перемен.\n\nПервые изменения кажутся незначительными, но каждое последствие порождает новые возможности. ${scenario}\n\nЧерез неделю становится ясно, что мир вокруг изменился кардинально. То, что началось как простое решение, превратилось в начало невероятного приключения. Герои обнаруживают, что даже самые незначительные действия могут иметь далеко идущие последствия.\n\nВ кульминации этой истории все участники понимают важный урок о взаимосвязанности всего сущего. Каждый из них становится частью большего целого, где личные выборы влияют на коллективную судьбу.`;
}
function generateRelationshipContent(storyAnalysis, whatIfElements, request) {
    const twists = [
        'Неожиданно оказалось бы, что это влечет за собой не только очевидные изменения, но и скрытые последствия, которые герои не могли предвидеть.',
        'В самый решающий момент герои обнаружили бы, что это открывает возможности, о которых они даже не мечтали.',
        'Судьба приготовила бы сюрприз: то, что казалось простым следствием, превратилось бы в начало невероятного приключения.'
    ];
    const twist = twists[Math.floor(Math.random() * twists.length)];
    return `Отношения между людьми - это живая экосистема, где любое изменение может кардинально преобразить всю динамику. Если бы ${whatIfElements.condition}, это открыло бы совершенно новые горизонты для взаимопонимания и связи.\n\n${twist}\n\nВ этом сценарии герои учатся видеть в каждом другом уникальную личность со своими страхами, мечтами и потенциалом. Они обнаруживают, что настоящая близость возникает не из схожести, а из умения принимать различия.\n\nС течением времени они понимают, что их отношения стали катализатором для роста не только друг друга, но и всех окружающих. Новая динамика отношений создает волны позитивных изменений, затрагивающих целые сообщества.`;
}
function generateOpportunityContent(storyAnalysis, whatIfElements, request) {
    const lessons = [
        'даже малейшие изменения в нашей жизни могут привести к грандиозным результатам',
        'смелость принимать неожиданные решения открывает двери в новые миры',
        'истинные возможности часто скрываются за привычными обстоятельствами',
        'жизнь полна сюрпризов для тех, кто готов их принять',
        'каждый выбор - это шанс написать свою уникальную историю'
    ];
    const lesson = lessons[Math.floor(Math.random() * lessons.length)];
    return `Жизнь полна скрытых возможностей, которые ждут подходящего момента, чтобы проявиться. Если бы ${whatIfElements.condition}, это открыло бы дверь в мир неограниченных перспектив.\n\nВ этом сценарии герои учатся замечать знаки судьбы и доверять интуитивным импульсам. То, что раньше казалось случайностью, теперь воспринимается как часть большего замысла. Каждый день приносит новые возможности для самовыражения и творчества.\n\nС течением времени они понимают, что ${lesson}. Их история становится примером для других, показывая, как смелость и открытость могут привести к неожиданным и прекрасным результатам.\n\nВ финале этой истории герои обнаруживают, что сами стали источником вдохновения для других. Их путь доказывает, что каждый момент жизни содержит в себе семя потенциального чуда.`;
}
function generateComplexContent(storyAnalysis, conditionalAnalysis, whatIfElements, request) {
    const climaxes = [
        'В момент наивысшего напряжения все обстоятельства сошлись воедино.',
        'Кульминация наступила внезапно, как гроза в ясный день.',
        'Пик истории ознаменовался моментом абсолютной ясности.'
    ];
    const climax = climaxes[Math.floor(Math.random() * climaxes.length)];
    return `В этом многогранном сценарии ${whatIfElements.condition} запускает сложную сеть взаимосвязанных изменений. Каждый аспект жизни получает новое измерение, создавая богатую палитру возможностей.\n\n${climax} Герои обнаруживают себя в центре водоворота событий, где их выборы имеют далеко идущие последствия. Реальность вокруг них становится пластичной, отзывчивой к их намерениям и эмоциям.\n\nПо мере развития событий становится ясно, что все линии сюжета ведут к одному кульминационному моменту. В этот решающий момент герои понимают, что их индивидуальные пути переплетаются в нечто большее, чем сумма отдельных историй.\n\nВ финале этой истории они осознают, что стали частью чего-то гораздо большего - глобальной трансформации сознания. Их опыт становится примером для других, показывая, как личные выборы могут привести к коллективным изменениям.`;
}
// Базовые функции извлечения информации
function extractCharacters(story) {
    if (story.includes('я ') || story.includes('мне ') || story.includes('мной ')) {
        return 'главный герой';
    }
    if (story.includes('мы ') || story.includes('нам ') || story.includes('нами ')) {
        return 'участники событий';
    }
    return 'персонажи истории';
}
function extractRelationships(story) {
    const relationships = [];
    if (/друг|товарищ|приятель/.test(story.toLowerCase()))
        relationships.push('дружба');
    if (/любов|романт|чувств/.test(story.toLowerCase()))
        relationships.push('романтические');
    if (/семь|родител|дети/.test(story.toLowerCase()))
        relationships.push('семейные');
    if (/коллег|работ|начальн/.test(story.toLowerCase()))
        relationships.push('профессиональные');
    return relationships.length > 0 ? relationships : ['межличностные'];
}
function extractLocations(story) {
    const locations = [];
    if (/дом|квартир/.test(story.toLowerCase()))
        locations.push('дом');
    if (/офис|работ/.test(story.toLowerCase()))
        locations.push('работа');
    if (/кафе|ресторан/.test(story.toLowerCase()))
        locations.push('общественное место');
    if (/улиц|парк|город/.test(story.toLowerCase()))
        locations.push('городская среда');
    return locations.length > 0 ? locations : ['неопределенное место'];
}
function extractTimeframe(story) {
    if (/вчера|недавно|на днях/.test(story.toLowerCase()))
        return 'недавнее прошлое';
    if (/давно|лет назад|когда-то/.test(story.toLowerCase()))
        return 'далекое прошлое';
    if (/сегодня|сейчас|в данный момент/.test(story.toLowerCase()))
        return 'настоящее';
    return 'неопределенное время';
}
function extractMainActions(story) {
    const actions = [];
    if (/встрет|увидел/.test(story.toLowerCase()))
        actions.push('встреча');
    if (/говор|сказал|рассказ/.test(story.toLowerCase()))
        actions.push('разговор');
    if (/решил|выбрал/.test(story.toLowerCase()))
        actions.push('принятие решения');
    if (/работ|делал/.test(story.toLowerCase()))
        actions.push('работа');
    return actions.length > 0 ? actions : ['общение'];
}
function extractSetting(story) {
    const settings = [
        { keywords: ['кафе', 'ресторан', 'бар'], result: 'уютное кафе' },
        { keywords: ['дом', 'квартира', 'комната'], result: 'домашняя обстановка' },
        { keywords: ['офис', 'работа', 'встреча'], result: 'рабочее пространство' },
        { keywords: ['улица', 'парк', 'город'], result: 'городская среда' },
        { keywords: ['школа', 'университет', 'учеба'], result: 'учебное заведение' }
    ];
    for (const setting of settings) {
        if (setting.keywords.some(keyword => story.toLowerCase().includes(keyword))) {
            return setting.result;
        }
    }
    return 'место действия';
}
function extractEmotions(story) {
    const emotions = [
        { keywords: ['радость', 'счастье', 'веселье'], result: 'радостные эмоции' },
        { keywords: ['грусть', 'печаль', 'тоска'], result: 'меланхолические переживания' },
        { keywords: ['удивление', 'неожиданно', 'внезапно'], result: 'удивление и любопытство' },
        { keywords: ['встреча', 'знакомство', 'друг'], result: 'теплые чувства воссоединения' }
    ];
    for (const emotion of emotions) {
        if (emotion.keywords.some(keyword => story.toLowerCase().includes(keyword))) {
            return emotion.result;
        }
    }
    return 'сложные эмоциональные переживания';
}
function extractMainAction(story) {
    const actions = [
        { keywords: ['встретил', 'встреча', 'увидел'], result: 'неожиданная встреча' },
        { keywords: ['рассказал', 'говорил', 'сказал'], result: 'важный разговор' },
        { keywords: ['решил', 'выбрал', 'подумал'], result: 'принятие решения' },
        { keywords: ['работа', 'бизнес', 'проект'], result: 'профессиональная деятельность' }
    ];
    for (const action of actions) {
        if (action.keywords.some(keyword => story.toLowerCase().includes(keyword))) {
            return action.result;
        }
    }
    return 'центральное событие истории';
}
function generateConsequenceFromCondition(condition) {
    const consequences = [
        'новые возможности открылись бы',
        'судьбы переплелись бы по-новому',
        'неожиданные двери распахнулись бы',
        'скрытые таланты проявились бы',
        'новые отношения зародились бы'
    ];
    return consequences[Math.floor(Math.random() * consequences.length)];
}
function generatePlotTwist(storyElements, whatIfElements) {
    const twists = [
        `Неожиданно оказалось бы, что ${whatIfElements.condition} влечет за собой не только очевидные изменения, но и скрытые последствия, которые ${storyElements.characters} не могли предвидеть.`,
        `В самый решающий момент ${storyElements.characters} обнаружили бы, что ${whatIfElements.condition} открывает возможности, о которых они даже не мечтали.`,
        `Судьба приготовила бы сюрприз: то, что казалось простым следствием ${whatIfElements.condition}, превратилось бы в начало невероятного приключения.`
    ];
    return twists[Math.floor(Math.random() * twists.length)];
}
function generateConsequences(request) {
    const consequences = [
        'жизненные приоритеты полностью пересмотрелись бы',
        'новые горизонты открылись бы для всех участников',
        'привычный мир трансформировался бы в нечто удивительное',
        'скрытые возможности стали бы реальностью',
        'неожиданные союзы и дружба зародились бы'
    ];
    return consequences[Math.floor(Math.random() * consequences.length)];
}
function generateAlternativeBeginning(storyElements) {
    const beginnings = [
        `С самого начала атмосфера была бы пропитана предчувствием перемен.`,
        `События развивались бы в ускоренном темпе, не оставляя времени на сомнения.`,
        `Первые моменты этой альтернативной истории были бы наполнены особым смыслом.`
    ];
    return beginnings[Math.floor(Math.random() * beginnings.length)];
}
function generateMiddlePart(storyElements, whatIfElements) {
    const middles = [
        `По мере развития событий становилось бы ясно, что каждое действие имеет далеко идущие последствия. ${storyElements.characters} обнаружили бы в себе силы, о которых не подозревали.`,
        `Кульминация этой истории принесла бы неожиданные откровения. То, что началось как простое изменение обстоятельств, превратилось бы в жизненный поворот.`,
        `В центре повествования ${storyElements.characters} столкнулись бы с выбором, который определил бы их дальнейшую судьбу.`
    ];
    return middles[Math.floor(Math.random() * middles.length)];
}
function generateEmotionalOutcome(request) {
    const outcomes = [
        'глубоким пониманием ценности каждого момента',
        'осознанием того, что жизнь полна неожиданных возможностей',
        'пониманием силы человеческих связей и взаимопонимания',
        'осознанием важности смелых решений',
        'глубокой благодарностью за жизненные повороты'
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
}
function generateDynamicScenario(storyElements, whatIfElements) {
    const scenarios = [
        `Развитие событий напоминало бы захватывающий роман: каждый день приносил бы новые открытия, каждое решение открывало бы неизведанные пути.`,
        `История превратилась бы в калейдоскоп возможностей, где каждый поворот событий раскрывал бы новые грани характеров и отношений.`,
        `Словно в увлекательном фильме, сюжет развивался бы стремительно, не давая участникам и момента для скуки.`
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}
function generateLifeLesson(request) {
    const lessons = [
        'даже малейшие изменения в нашей жизни могут привести к грандиозным результатам',
        'смелость принимать неожиданные решения открывает двери в новые миры',
        'истинные возможности часто скрываются за привычными обстоятельствами',
        'жизнь полна сюрпризов для тех, кто готов их принять',
        'каждый выбор - это шанс написать свою уникальную историю'
    ];
    return lessons[Math.floor(Math.random() * lessons.length)];
}
// Кульминация истории
function generateClimax(storyElements, whatIfElements) {
    const climaxes = [
        `В момент наивысшего напряжения все обстоятельства сошлись воедино. ${storyElements.characters} оказались перед выбором, который определил бы не только их собственное будущее, но и судьбы всех, кто их окружал. ${whatIfElements.condition} достигло своего пика влияния на реальность.

Время словно остановилось. В воздухе висела пауза, полная бесконечных возможностей. Каждое слово, каждый жест теперь имели вес целой вселенной. ${storyElements.setting} пульсировало энергией грядущих перемен.

В этот решающий момент ${storyElements.characters} поняли, что больше нет пути назад. Вперед лежал только один путь - через преобразование самих себя и окружающего мира. ${whatIfElements.consequence} достигло критической массы, готовое излиться в новую реальность.`,
        `Кульминация наступила внезапно, как гроза в ясный день. Все нити сюжета, которые терпеливо сплетались на протяжении всей истории, сошлись в одной точке невероятной интенсивности. ${storyElements.characters} обнаружили себя в центре водоворота событий, где ${whatIfElements.condition} проявило свою истинную силу.

Реальность вокруг них стала пластичной, отзывчивой к их намерениям и эмоциям. ${storyElements.emotions} достигли такой силы, что начали материально влиять на окружающий мир. Каждая мысль оставляла след в ткани бытия.

В этом кипящем котле трансформации ${storyElements.mainAction} трансформировалось в нечто грандиозное - момент рождения новой реальности, где все правила переписывались заново.`,
        `Пик истории ознаменовался моментом абсолютной ясности. ${storyElements.characters} внезапно увидели всю картину целиком - как ${whatIfElements.condition} было лишь началом, спусковым крючком для фундаментальных изменений в самой природе вещей.

В этот кульминационный момент границы между возможным и невозможным окончательно стерлись. ${storyElements.setting} превратилось в эпицентр космической трансформации. Энергия перемен достигла критической точки.

Все участники событий почувствовали, как через них проходит волна изменений, затрагивающая не только их личные судьбы, но и судьбу всего мира. Момент истины наступил - и выбор, который предстояло сделать, определил бы новый ход истории.`
    ];
    return climaxes[Math.floor(Math.random() * climaxes.length)];
}
// Развязка истории
function generateResolution(storyElements, whatIfElements) {
    const resolutions = [
        `После бури кульминации наступило время подведения итогов. ${storyElements.characters} обнаружили себя в мире, который стал одновременно знакомым и совершенно новым. ${whatIfElements.condition} завершило свою трансформативную работу, оставив за собой реальность, наполненную новыми возможностями.

Изменения оказались глубже, чем кто-либо мог предположить. Не только внешние обстоятельства изменились - трансформация затронула сами души участников. Они стали людьми, способными видеть мир под новыми углами, чувствовать связи, которые раньше оставались невидимыми.

${storyElements.setting} обрело новую жизнь, словно проснувшись от долгого сна. Каждый уголок этого пространства теперь дышал возможностями и скрытыми смыслами. ${storyElements.emotions} трансформировались в устойчивое состояние внутренней гармонии и готовности к новым открытиям.

Новый порядок вещей установился естественно, без принуждения или борьбы. Он возник как логичное продолжение всех предыдущих изменений.`,
        `Разрешение истории пришло как рассвет после долгой ночи неопределенности. ${storyElements.characters} постепенно начали осваиваться в новой реальности, где ${whatIfElements.condition} стало не просто изменением обстоятельств, но новым способом существования.

Оказалось, что все испытания и трансформации вели к этому моменту - к рождению более аутентичной и полной версии их самих. Страхи и сомнения, которые сопровождали их в начале пути, растворились в понимании того, что изменения были не только неизбежными, но и желанными.

${storyElements.mainAction} завершилось на ноте триумфа - не победы над чем-то внешним, а победы над собственными ограничениями. Новый мир, который они создали, отражал их самые глубокие чаяния и мечты.

Гармония воцарилась не как статичное состояние, а как динамичный баланс, полный жизни и движения вперед.`,
        `Финальная часть истории раскрыла истинный масштаб произошедших изменений. ${whatIfElements.condition} запустило процессы, которые простирались далеко за пределы первоначальных ожиданий. ${storyElements.characters} обнаружили, что стали частью чего-то гораздо большего - глобальной трансформации сознания.

Новая реальность установилась с удивительной легкостью. То, что казалось невозможным в начале истории, теперь стало естественной частью повседневной жизни. ${storyElements.setting} превратилось в живую экосистему возможностей, где каждый день приносил новые открытия.

Все участники событий почувствовали глубокое удовлетворение - не от достижения какой-то конкретной цели, а от самого процесса роста и трансформации. Они поняли, что конец этой истории является лишь началом еще более захватывающих приключений.`
    ];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
}
// Эпилог истории
function generateEpilogue(storyElements, whatIfElements, request) {
    const epilogues = [
        `Спустя некоторое время ${storyElements.characters} часто возвращались мыслями к тому удивительному периоду, когда ${whatIfElements.condition} изменило течение их жизни. То, что начиналось как простое "что если?", превратилось в глубочайшую трансформацию всего их существования.

Они поняли, что каждый момент жизни содержит в себе бесконечные возможности для изменений. ${storyElements.setting} стало для них местом силы, куда они возвращались всякий раз, когда нужно было вспомнить о магии превращений, которая всегда доступна тем, кто готов ее увидеть.

История эта стала легендой, которую они передавали другим - не как рассказ о чем-то исключительном, но как напоминание о том, что в каждом из нас дремлет потенциал для создания чудес. Вопрос "${request.whatIfQuestion}" стал для них символом открытости к новым возможностям.

И теперь, когда они встречали людей, застрявших в привычных паттернах, они с улыбкой спрашивали: "А что было бы, если...?" - зная, что этот простой вопрос может стать началом невероятных приключений.`,
        `Годы спустя влияние того времени, когда ${whatIfElements.condition} изменило их мир, продолжало ощущаться в каждом аспекте жизни ${storyElements.characters}. Они стали проводниками перемен, людьми, которые своим примером показывали другим, что реальность гораздо более пластична, чем принято считать.

Они создали вокруг себя сообщество единомышленников - людей, которые также осмелились задать вопрос "что если?" и пойти по пути трансформации. ${storyElements.setting} превратилось в центр этого движения, место, где собирались те, кто готов был исследовать границы возможного.

Их история стала источником вдохновения для многих. Люди приезжали издалека, чтобы услышать рассказ о том, как простое изменение перспективы может привести к фундаментальным переменам в жизни.

И самое удивительное - каждый, кто слышал эту историю, уносил с собой семя собственной трансформации. Эффект распространялся концентрическими кругами, создавая волны позитивных изменений в мире.`,
        `В эпилоге своей удивительной истории ${storyElements.characters} размышляли о том, как один простой вопрос "${request.whatIfQuestion}" стал ключом к пониманию бесконечной природы человеческого потенциала. ${whatIfElements.condition} оказалось не событием, а философией жизни.

Они поняли, что каждый день предлагает нам множество точек выбора, где мы можем сказать "да" новым возможностям или остаться в рамках привычного. Их опыт показал, что смелость сделать шаг в неизвестное вознаграждается открытиями, которые невозможно было даже вообразить.

Теперь они жили с постоянным чувством благодарности и удивления. ${storyElements.emotions} трансформировались в устойчивое состояние радости от самого факта существования в мире безграничных возможностей.

Их история стала доказательством того, что каждый человек - автор своей реальности, и что самые невероятные изменения начинаются с простого вопроса: "А что было бы, если...?"

И действительно - что было бы, если бы каждый из нас осмелился задать этот вопрос и последовать за ответом, куда бы он ни привел?`
    ];
    return epilogues[Math.floor(Math.random() * epilogues.length)];
}
// Запасной генератор сценариев на случай проблем с API
function generateFallbackScenario(request) {
    const templates = [
        `Если бы ${request.whatIfQuestion.toLowerCase()}, то история могла бы развиваться совершенно по-другому. Представьте себе, что события приняли неожиданный оборот...`,
        `Альтернативный сценарий: ${request.whatIfQuestion} - это интригующий вопрос. В таком случае главные герои оказались бы в совершенно иной ситуации...`,
        `Что если ${request.whatIfQuestion.toLowerCase()}? Тогда вся история изменилась бы кардинально. События развивались бы следующим образом...`
    ];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return `${randomTemplate}

[Примечание: Это автоматически сгенерированный пример. AI сервис временно недоступен, но мы работаем над улучшением качества генерации сценариев.]`;
}
// Альтернативная функция для использования другой модели
async function generateWithAlternativeModel(request) {
    try {
        // Используем Hugging Face API как основной
        console.log('Using Hugging Face API (alternative model)');
        const hfScenario = await generateWithHuggingFace(request);
        if (hfScenario) {
            console.log(`HF Generation completed (alternative), length: ${hfScenario.length} characters`);
            return {
                scenario: hfScenario,
                success: true
            };
        }
        // Если Hugging Face не сработал, используем локальный генератор как запасной вариант
        console.log('Using local creative generator as fallback (alternative)');
        const scenario = generateCreativeScenario(request);
        console.log(`Local generation completed (alternative), length: ${scenario.length} characters`);
        return {
            scenario,
            success: true
        };
    }
    catch (error) {
        console.error('Alternative AI Service Error:', error);
        // В случае ошибки возвращаем запасной сценарий
        return {
            scenario: generateFallbackScenario(request),
            success: false,
            error: error instanceof Error ? error.message : 'Ошибка альтернативной модели'
        };
    }
}
