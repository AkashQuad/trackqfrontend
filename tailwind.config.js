// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//         colors:{
//           'custom-pink' : '#ff4e50',
//           'custom-yellow' : '#f9d423',
//           'light-bg': {
//             1: '#FFF9F0',
//             2:'#F5F8FA',
//             3: '#F8F7FC'
//           },
//           'text-color':'#4A4A4A',
//           'muted-blue':'#7D31C2', //deep purple(#5A189A) or lighter-deep-purple(#7D31C2)
//           'dark-coral': '#FF6F00', // bright orange
//           'peach': '#FC9D9A'
//       }
//     }
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original colors
        'custom-pink': '#ff4e50',
        'custom-yellow': '#f9d423',
        'light-bg': {
          1: '#FFF9F0',
          2: '#F5F8FA',
          3: '#F8F7FC',
        },
        'text-color': '#4A4A4A',
        'muted-blue': '#7D31C2',
        'dark-coral': '#FF6F00',
        'peach': '#FC9D9A',
        // New colors inspired by andhuman.co
        'soft-purple': '#9F7AEA', // Lighter primary
        'muted-orange': '#FB923C', // Softer secondary
        'neutral': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          600: '#4B5563',
          800: '#1F2A44',
        },
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 6px rgba(0, 0, 0, 0.05)',
        'modal': '0 8px 20px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
 