export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Sora','sans-serif'] },
      animation: { 'fade-in':'fadeIn .4s ease-out', 'slide-up':'slideUp .4s ease-out' },
      keyframes: {
        fadeIn:  { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ opacity:0, transform:'translateY(16px)' }, to:{ opacity:1, transform:'translateY(0)' } },
      },
    },
  },
}
