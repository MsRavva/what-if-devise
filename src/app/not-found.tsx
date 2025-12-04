import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Страница не найдена</h2>
        <p className="text-muted-foreground mb-8">
          Извините, страница которую вы ищете не существует.
        </p>
        
        <Link href="/" className="gaming-button">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}