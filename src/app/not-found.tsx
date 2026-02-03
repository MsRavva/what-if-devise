import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden flex items-center justify-center px-6">
      {/* Тёмный официальный фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-slate-900 transform rotate-45 opacity-40" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-slate-800 transform -rotate-12 opacity-30" />
      </div>

      <div className="text-center max-w-md mx-auto relative z-10">
        <div className="w-24 h-24 border-2 border-red-900/50 bg-red-900/20 flex items-center justify-center mx-auto mb-8 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-8xl font-bold text-slate-800 mb-4 select-none">
          404
        </h1>

        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-slate-100">
          Страница не найдена
        </h2>

        <p className="text-slate-400 mb-8 font-mono">
          Извините, страница которую вы ищете не существует.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium uppercase tracking-wider transition-all rounded hover:text-white hover:border-slate-600"
        >
          <Home className="w-4 h-4" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}