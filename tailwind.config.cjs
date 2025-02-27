/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    './src/**/*.{html,js,ts,tsx}',
  ],
  theme: {
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px'
  	},
  	extend: {
  		fontFamily: {
  			montserrat: [
  				'Montserrat',
  				'sans-serif'
  			],
			sofia:[
				'Sofia Sans',
				'serif'
			],

  			bonanova: [
  				'Bona Nova',
  				'serif'
  			]
  		},
  		colors: {
  			pastelBlue: '#AEC6CF',
  			pastelGreen: '#B2D8B6',
  			pastelPink: '#F4C2C2',
  			pastelYellow: '#FAE3B2',
  			pastelPurple: '#D6CDEA',
  			pastelOrange: '#F2C9B0',
  			blue: '#0E162B',
  			'blue-light-1': '#F1F5F9',
  			'blue-light-2': '#D7E8FE',
  			'blue-1': '#046BF1',
  			'blue-2': '#0362DD',
  			'blue-3': '#035969',
  			'blue-4': ' #126180',
			'blue-400': '#465FFF',
			'blue-500': '#3641f5',
			'blue-600': '#1e2af4',
  			'navy-blue-1': '#043677	',
  			'navy-blue-2': '#032D63',
  			'navy-blue-3': '#02244F',
  			'navy-blue-4': '#021B3C',
  			'navy-blue-5': '#011228',
  			'dark-blue': '#060b18',
		
				gray: {
				  50: '#F9FAFB',
				  100: '#F3F4F6',
				  200: '#E5E7EB',
				  300: '#D1D5DB',
				  400: '#9CA3AF',
				  500: '#6B7280',
				  600: '#4B5563',
				  700: '#374151',
				  800: '#1F2937',
				  900: '#171F2F',  // Custom dark background
				  950: '#101828',  // Darker custom background
				},
			
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
