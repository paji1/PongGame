/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
  content: [
	"./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
	  fontFamily: {
		  'pixelify': ["Pixelify Sans", "sans-serif"],
		  'Nova': ["Nova Square", "sans-serif"]
		},
		extend: {
			colors: {
				'transparent': 'transparent',
				'current': 'currentColor',
				'background': '#E6E7E9',
				'primary': "#435899",
				'secondary': "#0076C0",
				'textColor': "#000301",
				'buttonColor': "#FEE04A",
				'sucessColor': "#24BEC8",
				'errorColor': "#F18DB3",
				'BkColor': "#E7E5DF",
				'DefaultColor': "#F2F2F2",
				'JacobsBlueColor': "#24BEC8"
			},
			boxShadow: {
				'buttonShadow': '6px 5px 0 0 #000301',
				'chatShadow': '-7px 1px 95px 1px rgba(0,3,1,0.75);'
			},
			animation: {
				text: 'text 5s ease infinite',
			  },
			  keyframes: {
				text: {
				  '0%, 100%': {
					'background-size': '200% 200%',
					'background-position': 'left center',
				  },
				  '50%': {
					'background-size': '200% 200%',
					'background-position': 'right center',
				  },
				},
			  },
			},
		  },
	plugins: [

	],
  }