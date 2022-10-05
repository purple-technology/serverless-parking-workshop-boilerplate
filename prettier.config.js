module.exports = {
	semi: false,
	singleQuote: true,
	useTabs: true,
	trailingComma: 'none',
	plugins: [require('prettier-plugin-tailwindcss')],
	tailwindConfig: './frontend/tailwind.config.js'
}
