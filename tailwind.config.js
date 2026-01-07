/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Adding the Yellow/Black theme colors if needed specifically here, 
                // though standard CSS variables in globals.css is preferred for theming.
                'theme-yellow': '#FFD700',
                'theme-black': '#000000',
            },
        },
    },
    plugins: [],
};
