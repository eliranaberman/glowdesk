import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Heebo', 'Inter var', 'system-ui', 'sans-serif'],
				display: ['Rubik', 'Poppins', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				warmBeige: '#F8F5F1',
				softRose: '#E8BCAA',
				mutedPeach: '#E6CCB9',
				deepNavy: '#364156',
				charcoal: '#3A3A3C',
				oliveGreen: '#7D8E6E',
				roseGold: '#D4B499',
				creamWhite: '#FFFBF5',
				softGray: '#F0EDE8',
				nail: {
					50: "#FCF7FD",
					100: "#F5E6F8",
					200: "#E8C8EF",
					300: "#D99FE3",
					400: "#C671D3",
					500: "#B54BC2",
					600: "#9C3DA7",
					700: "#793085",
					800: "#562362",
					900: "#331541",
					950: "#1F0C27"
				}
			},
			borderRadius: {
				'2xl': '1rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-in': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.05)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'scale-up': 'scale-up 0.2s ease-out',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'spin-slow': 'spin 3s linear infinite',
				'reverse': 'spin 1s linear infinite reverse',
			},
			animationDelay: {
				'150': '150ms',
				'300': '300ms',
				'450': '450ms',
			},
			textAlign: {
				'right': 'right',
				'left': 'left',
				'center': 'center',
			},
			boxShadow: {
				'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
				'soft-lg': '0 10px 30px 0 rgba(0, 0, 0, 0.05)',
				'button': '0 2px 6px 0 rgba(0, 0, 0, 0.05)',
				'card': '0 8px 24px rgba(149, 157, 165, 0.1)',
				'elevated': '0 8px 28px -2px rgba(0, 0, 0, 0.07)',
				'hover': '0 14px 34px -4px rgba(0, 0, 0, 0.08)',
				'glow': '0 0 20px rgba(212, 180, 153, 0.3)',
				'glow-soft': '0 0 15px rgba(212, 180, 153, 0.2)',
			},
			transitionTimingFunction: {
				'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: { addUtilities: any }) {
			addUtilities({
				'.animation-delay-150': {
					'animation-delay': '150ms',
				},
				'.animation-delay-300': {
					'animation-delay': '300ms',
				},
				'.animation-delay-450': {
					'animation-delay': '450ms',
				},
			})
		}
	],
} satisfies Config;
