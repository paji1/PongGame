/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
  content: [
	"./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
	  fontFamily: {
		  'pixelify': ["Pixelify Sans", "sans-serif"]
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
				'errorColor': "#F18DB3"
			},
			boxShadow: {
				'buttonShadow': '6px 5px 0 0 #000301'
			}
		},
  },
  plugins: [],
}

