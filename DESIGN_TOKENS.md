# Design Tokens - Cinematic Embassy + IELTS Brand

## Color System

### Base Colors (Dark-First)
```css
--background: 0 0% 100%;           /* White (light mode) */
--foreground: 222 47% 11%;         /* Near black */
--secondary: 217 33% 17%;          /* Deep charcoal navy */
--card: 0 0% 100%;                 /* White cards */
```

### Primary Accent (Electric Cyan/Teal)
```css
--primary: 197 92% 45%;            /* Electric cyan */
--accent: 197 92% 50%;             /* Bright teal */
--primary-foreground: 0 0% 100%;   /* White text */
```

### Supporting Colors
```css
--success: 142 76% 36%;            /* Green */
--warning: 38 92% 50%;             /* Amber */
--destructive: 0 84% 60%;          /* Red */
--muted: 210 40% 96%;              /* Light gray */
--muted-foreground: 215 16% 47%;   /* Medium gray */
```

### Special Gradients
```css
--gradient-primary: linear-gradient(135deg, hsl(197 92% 45%), hsl(190 85% 55%))
--gradient-hero: radial-gradient(ellipse at top, hsl(197 92% 45% / 0.15), transparent)
--gradient-visa: linear-gradient(135deg, hsl(217 33% 30%), hsl(217 33% 17%))
--gradient-ielts: linear-gradient(135deg, hsl(197 92% 45%), hsl(207 85% 55%))
```

## Typography

### Font Family
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Weights: 300, 400, 500, 600, 700, 800
```

### Type Scale
```css
Hero (H1): 6xl (96px) → 7xl (108px) → 8xl (128px)
Display (H2): 4xl (48px) → 5xl (60px) → 6xl (96px)
Large (H3): 2xl (32px) → 3xl (36px)
Body: xl (20px) → 2xl (24px)
Small: base (16px) → lg (18px)
Micro: sm (14px) → xs (12px)
```

### Line Heights
```css
Headlines: 1.1
Display: 1.2
Body: 1.5
Micro: 1.4
```

## Spacing System (8px base)

```css
xs: 0.5rem  (8px)
sm: 0.75rem (12px)
md: 1rem    (16px)
lg: 1.5rem  (24px)
xl: 2rem    (32px)
2xl: 3rem   (48px)
3xl: 4rem   (64px)
4xl: 6rem   (96px)
```

## Shadows & Depth

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-glow: 0 0 40px hsl(197 92% 45% / 0.3)
```

## Border Radius

```css
sm: 0.625rem  (10px)
md: 0.75rem   (12px)
lg: 1rem      (16px)
xl: 1.25rem   (20px)
2xl: 1.5rem   (24px)
full: 9999px
```

## Animation Timing

```css
Fast: 150ms
Normal: 300ms
Smooth: 500ms
Cinematic: 800ms - 1200ms
Slow: 2000ms+
```

### Easing Functions
```javascript
Spring: { type: 'spring', stiffness: 150, damping: 15 }
EaseOut: cubic-bezier(0.22, 1, 0.36, 1)
Lenis Scroll: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
```

## Effects & Interactions

### Glassmorphism
```css
background: card/50
backdrop-filter: blur(xl)
border: 1px border/50
```

### Magnetic Buttons
```javascript
Movement: 0.3x mouse delta
Spring: stiffness 150, damping 15, mass 0.1
```

### Scroll Parallax
```javascript
Hero opacity: scrollYProgress [0, 0.3] → [1, 0]
Hero scale: scrollYProgress [0, 0.3] → [1, 0.95]
```

### Hover States
```css
Cards: translateY(-8px) + border-primary/50
Buttons: opacity 90% + shadow-glow
Icons: scale(1.1) + rotate
```

## Embassy/IELTS Visual Cues

### Embassy Motifs
- Passport stamp (rotating holographic)
- Security patterns (subtle scanlines)
- Document textures (microtext)
- Official seals (circular with stars)
- Government color: Deep navy + teal accent

### IELTS Motifs
- Waveform patterns (speaking)
- Writing lines (subtle)
- Timer UI elements
- Band score visualization
- Academic color: Teal + clean surfaces

## Component Patterns

### Feature Cards
```css
Base: rounded-2xl, p-8, bg-card
Hover: y: -8px, border-primary/50
Icon: 56px circle, gradient background
Shadow: shadow-lg on hover
```

### CTA Buttons (Primary)
```css
Base: gradient from-primary to-accent
Size: Large (px-10 py-7)
Hover: opacity-90 + shadow-primary/50
Animation: Gradient slide on hover
```

### Stats Display
```css
Value: 4xl-5xl font-bold gradient-text
Label: sm text-muted-foreground
Animation: Scale from 0 with back easing
```

## Breakpoints

```css
Mobile: default
Tablet: 768px (md)
Desktop: 1024px (lg)
Large: 1280px (xl)
XLarge: 1536px (2xl)
```

## Performance Notes

- Lenis smooth scroll: 60fps target
- GSAP animations: GPU-accelerated
- Framer Motion: will-change optimization
- Images: lazy loading + blur placeholder
- Videos: autoplay muted with fallback
- Respect prefers-reduced-motion
