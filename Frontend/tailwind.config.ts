import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightblue: '#CBD9F5', 
        skyblue: '#052941',
        deepPurple: '#250A14',
        gold: '#FFD700',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, #2D4059 0%, #4E6E58 100%)'
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
