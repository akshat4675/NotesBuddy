/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px'
		},
		colors: {
			blue: '#1fb6ff',
			purple: '#7e5bef',
			pink: '#ff49db',
			orange: '#ff7849',
			green: '#13ce66',
			yellow: '#ffc82c',
			'gray-dark': '#273444',
			gray: '#8492a6',
			'gray-light': '#d3dce6'
		},
		fontFamily: {
			sans: ['Graphik', 'sans-serif'],
			serif: ['Merriweather', 'serif']
		},
		extend: {
			spacing: {
				'128': '32rem',
				'144': '36rem'
			},
			borderRadius: {
				'4xl': '2rem'
			}
		}
	},
	extend: {
		colors: {
			'primary-500': '#877EFF',
			'primary-600': '#5D5FEF',
			'secondary-500': '#FFB620',
			'off-white': '#D0DFFF',
			red: '#FF5A5A',
			'dark-1': '#000000',
			'dark-2': '#09090A',
			'dark-3': '#101012',
			'dark-4': '#1F1F22',
			'light-1': '#FFFFFF',
			'light-2': '#EFEFEF',
			'light-3': '#7878A3',
			'light-4': '#5C5C7B'
		},
		screens: {
			xs: '480px'
		},
		width: {
			'420': '420px',
			'465': '465px'
		},
		fontFamily: {
			inter: ['Inter', 'sans-serif']
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
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	}
},
}