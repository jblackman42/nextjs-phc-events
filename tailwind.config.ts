import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
    	screens: {
    		sm: '640px',
    		md: '768px',
    		lg: '1024px',
    		xl: '1200px',
    		'2xl': '1536px'
    	},
    	extend: {
    		colors: {
    			textPrimary: 'var(--text-primary)',
    			textSecondary: 'var(--text-secondary)',
    			textHeading: 'var(--heading-text)',
    			border: 'var(--border)',
    			input: 'var(--input)',
    			ring: 'var(--ring)',
    			background: {
    				DEFAULT: 'var(--background)',
    				foreground: 'var(--foreground)'
    			},
    			primary: {
    				DEFAULT: 'var(--primary)',
    				foreground: 'var(--primary-foreground)'
    			},
    			secondary: {
    				DEFAULT: 'var(--secondary)',
    				foreground: 'var(--secondary-foreground)'
    			},
    			accent: {
    				'0': 'var(--accent-0)',
    				'2': 'var(--accent-2)',
    				'3': 'var(--accent-3)',
    				DEFAULT: 'var(--accent)',
    				foreground: 'var(--accent-foreground)'
    			},
    			popover: {
    				DEFAULT: 'var(--popover)',
    				foreground: 'var(--popover-foreground)'
    			},
    			destructive: 'var(--destructive)',
    			muted: 'var(--muted)',
    			smoky: 'var(--smoky)',
    			crtvBackground: '#daddd4',
    			crtvAccent: '#628395'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 4px)',
    			sm: 'calc(var(--radius) - 6px)'
    		},
    		keyframes: {
    			'fade-slide-down': {
    				from: {
    					opacity: '0',
    					transform: 'translate(5%, 20%)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'translate(0,0)'
    				}
    			},
    			'skeleton-breathe': {
    				'0%': {
    					backgroundColor: 'var(--secondary)'
    				},
    				'50%': {
    					backgroundColor: 'var(--background)'
    				},
    				'100%': {
    					backgroundColor: 'var(--secondary)'
    				}
    			},
    			'calendar-fade': {
    				'0%': {
    					transform: 'translate(5%, 20%)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translate(0, 0)',
    					opacity: '1'
    				}
    			},
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
    			'fade-slide-down': 'fade-slide-down 500ms ease-in-out forwards',
    			'skeleton-breathe': 'skeleton-breathe 2s ease-in-out infinite',
    			'calendar-fade': 'calendar-fade 500ms ease-in-out 200ms 1 normal forwards',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config