import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'card-foreground': 'hsl(var(--card-foreground))',
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			'popover-foreground': 'hsl(var(--popover-foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-foreground': 'hsl(var(--primary-foreground))',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			'secondary-foreground': 'hsl(var(--secondary-foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			'muted-foreground': 'hsl(var(--muted-foreground))',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			'accent-foreground': 'hsl(var(--accent-foreground))',
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			'destructive-foreground': 'hsl(var(--destructive-foreground))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			'chart-1': 'hsl(var(--chart-1))',
  			'chart-2': 'hsl(var(--chart-2))',
  			'chart-3': 'hsl(var(--chart-3))',
  			'chart-4': 'hsl(var(--chart-4))',
  			'chart-5': 'hsl(var(--chart-5))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'scale-in': 'scaleIn 0.3s ease-out',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			
  			// 🚀 Киберпанк анимации
  			'hologram': 'hologram-shift 3s ease-in-out infinite',
  			'neural-flow': 'neural-flow 20s linear infinite',
  			'energy-rotate': 'energy-rotate 2s linear infinite',
  			'glitch': 'glitch 2s infinite',
  			'quantum-spin': 'quantum-spin 1s linear infinite',
  			'data-pulse': 'data-pulse 2s ease-in-out infinite',
  			'energy-flow': 'energy-flow 4s ease-in-out infinite',
  			'quantum-flicker': 'quantum-flicker 3s ease-in-out infinite',
  			'matrix-dissolve': 'matrix-dissolve 0.8s ease-in-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 5px hsl(var(--primary))'
  				},
  				'100%': {
  					boxShadow: '0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))'
  				}
  			},
  			
  			// 🚀 Киберпанк keyframes
  			'hologram-shift': {
  				'0%, 100%': { 
  					backgroundPosition: '0% 0%',
  					filter: 'hue-rotate(0deg)'
  				},
  				'50%': { 
  					backgroundPosition: '100% 100%',
  					filter: 'hue-rotate(180deg)'
  				}
  			},
  			'neural-flow': {
  				'0%': { 
  					transform: 'translate(0, 0)',
  					opacity: '0.6'
  				},
  				'50%': {
  					opacity: '0.8'
  				},
  				'100%': { 
  					transform: 'translate(-100px, -100px)',
  					opacity: '0.6'
  				}
  			},
  			'energy-rotate': {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' }
  			},
  			'glitch': {
  				'0%, 100%': { transform: 'translate(0)' },
  				'20%': { transform: 'translate(-2px, 2px)' },
  				'40%': { transform: 'translate(-2px, -2px)' },
  				'60%': { transform: 'translate(2px, 2px)' },
  				'80%': { transform: 'translate(2px, -2px)' }
  			},
  			'quantum-spin': {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' }
  			},
  			'data-pulse': {
  				'0%, 100%': { 
  					transform: 'scale(1)',
  					boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
  				},
  				'50%': { 
  					transform: 'scale(1.05)',
  					boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)'
  				}
  			},
  			'energy-flow': {
  				'0%': { 
  					backgroundPosition: '0% 50%',
  					filter: 'hue-rotate(0deg)'
  				},
  				'50%': { 
  					backgroundPosition: '100% 50%',
  					filter: 'hue-rotate(180deg)'
  				},
  				'100%': { 
  					backgroundPosition: '0% 50%',
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			'quantum-flicker': {
  				'0%, 100%': { opacity: '1' },
  				'25%': { opacity: '0.8' },
  				'50%': { opacity: '0.9' },
  				'75%': { opacity: '0.7' }
  			},
  			'matrix-dissolve': {
  				'0%': {
  					opacity: '1',
  					transform: 'scale(1) rotateX(0deg)',
  					filter: 'blur(0px)'
  				},
  				'50%': {
  					opacity: '0.5',
  					transform: 'scale(0.8) rotateX(90deg)',
  					filter: 'blur(5px)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'scale(0.6) rotateX(180deg)',
  					filter: 'blur(10px)'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config