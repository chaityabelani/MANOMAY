/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Color Palette - High-Contrast Orange for Food Apps
                brand: {
                    50: '#fff7ed',  // Light backgrounds
                    100: '#ffedd5', // Accents
                    500: '#f97316', // Decorative icons
                    600: '#ea580c', // MAIN BUTTONS (Primary brand color)
                    900: '#7c2d12', // Dark text on orange backgrounds
                },
                // Functional Aliases for easier usage
                primary: '#ea580c',      // Orange-600
                secondary: '#0f172a',    // Slate-900
                // CSS Variable-based colors for shadcn/ui compatibility
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                // Original primary/secondary (now aliased above, but keeping for shadcn consistency if needed)
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Brand Colors - Food Industry Orange/Amber
                brand: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316', // Primary
                    600: '#ea580c', // Hover
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                // Vendor Theme - Professional Purple/Indigo
                vendor: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1', // Primary
                    600: '#4f46e5', // Hover
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // Semantic Colors
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                // Neutral Grays
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Cal Sans', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
                'glow-vendor': '0 0 20px rgba(99, 102, 241, 0.3)',
                'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
            },
            backdropBlur: {
                xs: '2px',
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-ring": {
                    "0%": { opacity: "0", transform: "scale(0.8)" },
                    "50%": { opacity: "0.4" },
                    "100%": { opacity: "0", transform: "scale(1.5)" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(-5%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
                    "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-out forwards",
                "slide-up": "slide-up 0.6s ease-out forwards",
                "float": "float 3s ease-in-out infinite",
                "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "shimmer": "shimmer 2s linear infinite",
                "bounce-slow": "bounce-slow 2s infinite",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 0%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%)',
            },
        },
    },
    plugins: [],
};
