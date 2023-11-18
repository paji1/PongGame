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
				'primary': "#435899",
				'secondary': "#0076C0",
				'textColor': "#000301",
				'buttonColor': "#FEE04A",
				'sucessColor': "#24BEC8",
				'errorColor': "#F18DB3"
			},
			boxShadow: {
				// 'test': '-10px 10px 0 0 #F18DB3',
				'zbi': '100px 50px 5px 5px #000000'
			  }
		},
  },
  plugins: [],
}

