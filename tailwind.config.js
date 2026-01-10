import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./index.html",
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'rgb(var(--color-primary) / 0.05)',
					100: 'rgb(var(--color-primary) / 0.1)',
					200: 'rgb(var(--color-primary) / 0.2)',
					300: 'rgb(var(--color-primary) / 0.3)',
					400: 'rgb(var(--color-primary) / 0.4)',
					500: 'rgb(var(--color-primary) / 0.5)',
					600: 'rgb(var(--color-primary) / 0.6)',
					700: 'rgb(var(--color-primary) / 0.7)',
					800: 'rgb(var(--color-primary) / 0.8)',
					900: 'rgb(var(--color-primary) / 0.9)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'rgb(var(--color-secondary) / 0.05)',
					100: 'rgb(var(--color-secondary) / 0.1)',
					200: 'rgb(var(--color-secondary) / 0.2)',
					300: 'rgb(var(--color-secondary) / 0.3)',
					400: 'rgb(var(--color-secondary) / 0.4)',
					500: 'rgb(var(--color-secondary) / 0.5)',
					600: 'rgb(var(--color-secondary) / 0.6)',
					700: 'rgb(var(--color-secondary) / 0.7)',
					800: 'rgb(var(--color-secondary) / 0.8)',
					900: 'rgb(var(--color-secondary) / 0.9)',
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
					foreground: 'hsl(var(--accent-foreground))',
					50: 'rgb(var(--color-accent) / 0.05)',
					100: 'rgb(var(--color-accent) / 0.1)',
					200: 'rgb(var(--color-accent) / 0.2)',
					300: 'rgb(var(--color-accent) / 0.3)',
					400: 'rgb(var(--color-accent) / 0.4)',
					500: 'rgb(var(--color-accent) / 0.5)',
					600: 'rgb(var(--color-accent) / 0.6)',
					700: 'rgb(var(--color-accent) / 0.7)',
					800: 'rgb(var(--color-accent) / 0.8)',
					900: 'rgb(var(--color-accent) / 0.9)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					50: 'rgb(var(--color-success) / 0.05)',
					100: 'rgb(var(--color-success) / 0.1)',
					500: 'rgb(var(--color-success) / 0.5)',
					600: 'rgb(var(--color-success) / 0.6)',
				},
				warning: {
					50: 'rgb(var(--color-warning) / 0.05)',
					100: 'rgb(var(--color-warning) / 0.1)',
					500: 'rgb(var(--color-warning) / 0.5)',
					600: 'rgb(var(--color-warning) / 0.6)',
				},
				error: {
					50: 'rgb(var(--color-error) / 0.05)',
					100: 'rgb(var(--color-error) / 0.1)',
					500: 'rgb(var(--color-error) / 0.5)',
					600: 'rgb(var(--color-error) / 0.6)',
				},
				surface: 'rgb(var(--color-surface) / <alpha-value>)',
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
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
