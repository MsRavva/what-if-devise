'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HologramCard, GlitchText, EnergyButton } from '@/components/cyberpunk';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 neural-particles">
                    {/* Фоновые эффекты */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 transform rotate-45 opacity-20 animate-data-pulse" />
                        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 transform -rotate-12 opacity-25 animate-quantum-flicker" />
                    </div>

                    <HologramCard variant="energy" className="max-w-lg w-full p-8 relative z-10">
                        <div className="text-center">
                            {/* Иконка ошибки */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-data-pulse">
                                <AlertTriangle className="w-10 h-10 text-black" />
                            </div>

                            {/* Заголовок */}
                            <GlitchText className="text-3xl font-black uppercase mb-4" color="pink">
                                System Error
                            </GlitchText>

                            {/* Описание */}
                            <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed">
                                Произошла непредвиденная ошибка. Мы уже работаем над её устранением.
                            </p>

                            {/* Детали ошибки (только для разработчиков) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-black/50 border border-red-500/30 text-left overflow-auto max-h-40">
                                    <p className="text-red-400 text-xs font-mono break-all">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            {/* Кнопки действий */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <EnergyButton
                                    variant="primary"
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Попробовать снова
                                </EnergyButton>

                                <EnergyButton variant="secondary">
                                    <Link href="/" className="flex items-center justify-center gap-2">
                                        <Home className="w-4 h-4" />
                                        На главную
                                    </Link>
                                </EnergyButton>
                            </div>
                        </div>
                    </HologramCard>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
