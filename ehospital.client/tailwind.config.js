/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#02c39a",
                secondary: {
                    1: "#028090",
                    2: "#00a896",
                    3: "#f0f3bd",
                },
            },
            fontFamily: {
                body: ["Nunito"],
            },
            gridTemplateColumns: {
                auto: "repeat(auto-fill, minmax(230px, 1fr))",
            },
        },
    },
    plugins: [],
}
