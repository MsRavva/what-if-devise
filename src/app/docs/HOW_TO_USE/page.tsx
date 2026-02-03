"use client"

import Link from 'next/link'
import { ArrowLeft, BookOpen, Zap, MessageSquare, History, User } from 'lucide-react'
import { HologramCard, GlitchText } from '@/components/cyberpunk'

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
                <div className="absolute bottom-40 right-20 w-40 h-40 bg-slate-800 transform -rotate-12 opacity-30" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад на главную
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <GlitchText className="text-4xl md:text-5xl font-bold uppercase mb-4">
                        Как использовать
                    </GlitchText>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Полное руководство по генерации альтернативных сценариев и использованию возможностей платформы.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <HologramCard>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">Генерация сценариев</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Перейдите в раздел "Create" чтобы начать. Опишите ситуацию в формате "Что если...", и наш ИИ создаст подробное развитие событий.
                        </p>
                        <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
                            <li>Используйте четкие вопросы</li>
                            <li>Добавляйте контекст ситуации</li>
                            <li>Экспериментируйте с жанрами</li>
                        </ul>
                    </HologramCard>

                    <HologramCard>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-800">
                                <BookOpen className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">Шаблоны</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Нет идей? Используйте раздел "Templates". Мы собрали 64 готовых шаблона для разных жанров: от романтики до научной фантастики. Выберите шаблон и адаптируйте его под себя.
                        </p>
                    </HologramCard>

                    <HologramCard>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-900/30 rounded-lg border border-emerald-800">
                                <MessageSquare className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">AI Чат</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Общайтесь с персонажами ваших историй или задавайте уточняющие вопросы ИИ-ассистенту в режиме реального времени. Чат сохраняет контекст вашей истории.
                        </p>
                    </HologramCard>

                    <HologramCard>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-900/30 rounded-lg border border-amber-800">
                                <History className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">История и Профиль</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Все ваши генерации сохраняются в Истории (требуется авторизация). В профиле вы можете управлять настройками аккаунта и визуальными предпочтениями.
                        </p>
                    </HologramCard>
                </div>
            </div>
        </div>
    )
}
