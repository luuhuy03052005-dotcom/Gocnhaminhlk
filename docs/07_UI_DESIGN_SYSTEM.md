# 07 — UI Design System

## Brand Personality

Góc Nhà Mình must feel:

- Warm
- Cozy
- Calm
- Boutique cafe
- Friendly
- Clear
- Not corporate
- Not overly colorful

## Brand Colors

```json
{
  "coffeeDark": "#2C2017",
  "caramel": "#C8873A",
  "warmBrown": "#A06828",
  "cream": "#FDF6EE",
  "surface": "#F5EDE0",
  "border": "#EDE4D8",
  "mutedText": "#7A6A55",
  "bodyText": "#6A5A4A"
}
```

## Typography

Web:

- Heading: Playfair Display
- Body: Inter

Admin Flutter:

- Use a clean sans-first approach.
- Serif may be used lightly for brand headings, not dense admin data.

## UI Principles

| Area | Rule |
|---|---|
| Web landing | Keep existing layout and feeling |
| Customer Portal | Friendly, mobile-first, clear CTA |
| Admin App | Functional, fast, not decorative |
| Buttons | Rounded, clear hierarchy |
| Cards | Soft radius, light border, minimal shadow |
| Forms | Large touch targets, clear error messages |
| Loading | Must handle Render cold start gracefully |
| Error | Human-readable, not raw stack traces |

## Do Not

- Do not introduce random neon colors.
- Do not overuse icons.
- Do not over-animate admin screens.
- Do not make admin app look like a marketing landing page.
- Do not break the current landing page style.
