import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden neural-particles flex items-center justify-center px-6">
      {/* Киберпанк фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 transform rotate-45 opacity-20 animate-data-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 transform -rotate-12 opacity-15 animate-hologram" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-energy-flow" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-energy-flow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="text-center max-w-md mx-auto relative z-10">
        {/* Error Icon */}
        <div className="w-24 h-24 border-4 border-red-500 flex items-center justify-center mx-auto mb-8 animate-quantum-spin">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-500 mb-4 animate-glitch">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-white">
          Страница не найдена
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8 font-mono">
          Извините, страница которую вы ищете не существует или была удалена.
        </p>

        {/* Back Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 border-2 border-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 font-bold uppercase tracking-wider transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}