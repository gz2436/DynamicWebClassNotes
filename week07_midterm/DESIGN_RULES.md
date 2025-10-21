# ResumeAI Design System Rules

## Core Design Principles

### 1. Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500, 600 (semi-bold), 700 (bold), 800 (extra-bold), 900 (black)
- **Letter Spacing**: -0.02em for large headings, 0.3px for buttons

### 2. Color Palette
- **Primary**: White (#ffffff)
- **Text**: Dark gray (#1a1a1a, #333333)
- **Secondary Text**: Medium gray (#666666, #888888)
- **Accent Gradient**: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- **Borders**: rgba(0, 0, 0, 0.08) - rgba(0, 0, 0, 0.15)
- **Backgrounds**: White (#ffffff), Light gray (#f8f9fa, #fafbfc)

### 3. Buttons - White Capsule Style
**All buttons must follow this style:**
```css
background: white;
color: #1a1a1a;
border: 2px solid rgba(0, 0, 0, 0.08);
border-radius: 50px;
font-weight: 700;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
letter-spacing: 0.3px;
transition: all 0.3s ease;
```

**Hover State:**
```css
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
border-color: rgba(0, 0, 0, 0.12);
```

### 4. Logo Icon (CSS-based)
**Standard Logo:**
```css
width: 24px;
height: 24px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 6px;
```
With white center square (14px × 14px, border-radius: 3px)

**Small Logo (20px):**
```css
width: 20px;
height: 20px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 5px;
```
With white center square (12px × 12px, border-radius: 2px)

### 5. Avatar Icons (CSS-based)
**User Avatar (Circle):**
```css
width: 40px;
height: 40px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 50%;
```
With white center circle (24px diameter)

**AI Avatar (Square Logo):**
```css
width: 32px;
height: 32px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 6px;
```
With white center square (18px × 18px, border-radius: 3px)

### 6. Spacing & Layout
- **Section Padding**: 2rem - 4rem
- **Element Gap**: 0.5rem - 2rem
- **Border Radius**: 6px (small), 12px (medium), 25px-50px (buttons)

### 7. Shadows
- **Light**: 0 1px 3px rgba(0, 0, 0, 0.08)
- **Medium**: 0 2px 8px rgba(0, 0, 0, 0.08)
- **Elevated**: 0 4px 12px rgba(0, 0, 0, 0.12)

### 8. Animations
- **Transition**: all 0.3s ease
- **Hover Lift**: translateY(-2px) to translateY(-3px)
- **Fade In**: opacity 0 → 1, with translateY(10px) → translateY(0)

## STRICT RULES

### ❌ NEVER USE:
1. **Emojis** - No emoji characters anywhere in the UI
2. **Flat buttons** - All buttons must have shadow and border
3. **Multiple font families** - Only Inter is allowed
4. **Bright/saturated colors** - Stick to the defined palette
5. **Square buttons** - All buttons are capsule-shaped (border-radius: 50px)

### ✅ ALWAYS USE:
1. **CSS-based icons** - Logo and avatars are pure CSS
2. **White capsule buttons** - Consistent across all pages
3. **Inter font** - For all text elements
4. **Subtle shadows** - For depth and elevation
5. **Smooth transitions** - 0.3s ease for all interactions

## Component Standards

### Buttons
- Primary CTA: Large white capsule, uppercase text
- Secondary: Medium white capsule, normal case
- Exit/Cancel: Small white capsule

### Cards
- Background: White
- Border: 1px solid rgba(0, 0, 0, 0.05)
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
- Hover: Lift 2px with enhanced shadow

### Inputs
- Border: 2px solid #e5e7eb
- Border Radius: 25px (capsule)
- Focus: border-color #667eea with 3px glow
- Font: Inter, 1rem

### Message Bubbles
- AI: Light gray (#f8f9fa), left-aligned
- User: Purple gradient, right-aligned
- Border Radius: 12px
- Padding: 1rem 1.25rem

## Responsive Breakpoints
- Mobile: max-width 768px
- Tablet: 769px - 1024px
- Desktop: 1025px+

## Accessibility
- Minimum contrast ratio: 4.5:1
- Focus indicators: Always visible
- Touch targets: Minimum 44px × 44px
- Semantic HTML: Required

---

**Last Updated**: 2025-10-21
**Version**: 1.0
