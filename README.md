# Meridian & Co. — React + Framer Motion

A React port of the Meridian luxury real estate concept, using `motion.*` components,
`whileInView` scroll reveals, `pathLength` SVG draw-on animations, and spring-based
magnetic buttons / custom cursor.

## Setup

```bash
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Drop `tailwind.config.js` in your project root (or merge the `theme.extend` block into
your existing config), and import `index.css` once at your app's entry point.

Then render:

```jsx
import MeridianEstates from "./MeridianEstates";

export default function App() {
  return <MeridianEstates />;
}
```

## What changed from the HTML/CSS version

| Effect | HTML/CSS version | React version |
|---|---|---|
| Hero headline stagger | CSS keyframes + animation-delay | `variants` + `staggerChildren` |
| SVG elevation draw-on | `stroke-dasharray`/`stroke-dashoffset` | `pathLength` animated by Framer Motion |
| Scroll reveals | `IntersectionObserver` + class toggle | `whileInView` |
| Magnetic button | none (static hover) | pointer-tracked `x`/`y` motion values with spring physics |
| Custom cursor | `mousemove` listener, manual style writes | motion values + `useSpring` for smooth trailing |
| Contact form labels | CSS class toggling | `animate` on `motion.label` |
| Submit confirmation | `innerHTML` swap + `setTimeout` | `AnimatePresence` cross-fade |

## Notes

- Colors, type scale, and copy are unchanged from the original — only the animation
  implementation moved to Framer Motion idioms.
- `viewport={{ once: true }}` is set on scroll reveals so they don't re-trigger when
  scrolling back up; drop it if you want replay behavior.
- Respects `prefers-reduced-motion` globally via `index.css`.
- Swap the hand-drawn SVG elevations in `PROPERTIES` for real listing photography
  whenever you have it — just replace the `<svg>` block in `PropertyCard` with an
  `<motion.img>` and animate `opacity`/`scale` instead of `pathLength`.
