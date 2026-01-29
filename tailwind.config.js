export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
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
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'serif': ['Merriweather', 'Georgia', 'serif'],
				'merriweather': ['Merriweather', 'Georgia', 'serif'],
				'inter': ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'body': ['1rem', { lineHeight: '1.6' }],
				'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '900' }],
				'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
				'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '700' }],
				'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
				'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
				'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
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
				// Custom Electric Teal and Warm Cream colors
				'electric-teal': '#14b8a6',
				'deep-teal': '#0d9488',
				'bright-teal': '#2dd4bf',
				'soft-teal': '#ccfbf1',
				'butter-yellow': '#fde047',
				'pale-lemon': '#fef9c3',
				'coral': '#f87171',
				'ai-violet': '#a78bfa',
				'charcoal': '#1c1917',
				'warm-gray': '#78716c',
				'warm-cream': '#fffbeb',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				'3xl': 'calc(var(--radius) + 16px)',
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
			},
			letterSpacing: {
				'tighter': '-0.05em',
				'tight': '-0.02em',
				'normal': '0',
				'wide': '0.02em',
				'wider': '0.05em',
				'widest': '0.1em',
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
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'float-delayed': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-delayed': 'float 6s ease-in-out infinite 2s',
				'shimmer': 'shimmer 1.5s infinite',
				'fade-in': 'fadeIn 0.3s ease-out',
				float: 'float 6s ease-in-out infinite',
				'float-delayed': 'float-delayed 8s ease-in-out infinite 2s',

				shimmer: 'shimmer 1.5s infinite',
				'fade-in': 'fadeIn 0.3s ease-out',
			},

		}
	},
	plugins: [require("tailwindcss-animate")],
};