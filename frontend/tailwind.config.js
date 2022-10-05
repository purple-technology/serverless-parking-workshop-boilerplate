/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
		'../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
			colors: {
				'blue-500': 'rgb(130,79,167)',
				'blue-700': 'rgb(82,36,115)'
			}
		},
  },
  plugins: [require('flowbite/plugin')],
}
