# Character Animation Integration

This folder contains lightweight animated character assets for the German learning app. Each character has a transparent four-frame PNG sequence intended for friendly idle moments in lessons, quiz feedback, onboarding, and reward screens.

## Asset Locations

Main preview:

```text
assets/images/characters/animations/preview.html
```

Top-level manifest:

```text
assets/images/characters/animations/character-animation-manifest.json
```

Per-character folders:

```text
assets/images/characters/animations/
  teacher-guide/
  child-learner/
  teen-learner/
  parent-learner/
```

Each character folder contains:

```text
animation-manifest.json
sprite-sheet.png
sprite-sheet-chromakey.png
frames/
  frame-1.png
  frame-2.png
  frame-3.png
  frame-4.png
```

Use `sprite-sheet.png` or the individual `frames/*.png` files in the app. Keep `sprite-sheet-chromakey.png` only as source material.

## Frame Meaning

All characters follow the same frame order:

```text
frame-1.png  neutral
frame-2.png  subtle breathe/up motion
frame-3.png  small friendly gesture
frame-4.png  blink/smile
```

Recommended timing:

```text
loop duration: 3600ms
recommended fps: 3
playback: loop
```

These are intentionally slow and subtle so the characters feel alive without distracting from vocabulary, listening, or quiz interactions.

## Basic CSS Implementation

The simplest implementation stacks the four transparent PNGs and swaps opacity with a stepped animation.

```html
<div class="animated-character" aria-hidden="true">
  <img src="/assets/images/characters/animations/teacher-guide/frames/frame-1.png" alt="">
  <img src="/assets/images/characters/animations/teacher-guide/frames/frame-2.png" alt="">
  <img src="/assets/images/characters/animations/teacher-guide/frames/frame-3.png" alt="">
  <img src="/assets/images/characters/animations/teacher-guide/frames/frame-4.png" alt="">
</div>
```

```css
.animated-character {
  position: relative;
  width: 280px;
  height: 440px;
}

.animated-character img {
  position: absolute;
  left: 50%;
  bottom: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transform: translateX(-50%);
  animation-duration: 3.6s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animated-character img:nth-child(1) { animation-name: characterFrame1; }
.animated-character img:nth-child(2) { animation-name: characterFrame2; }
.animated-character img:nth-child(3) { animation-name: characterFrame3; }
.animated-character img:nth-child(4) { animation-name: characterFrame4; }

@keyframes characterFrame1 {
  0%, 18%, 100% { opacity: 1; }
  25%, 93% { opacity: 0; }
  96% { opacity: 0.55; }
}

@keyframes characterFrame2 {
  0%, 17%, 55%, 100% { opacity: 0; }
  24%, 43% { opacity: 1; }
}

@keyframes characterFrame3 {
  0%, 42%, 80%, 100% { opacity: 0; }
  49%, 68% { opacity: 1; }
}

@keyframes characterFrame4 {
  0%, 67%, 100% { opacity: 0; }
  74%, 92% { opacity: 1; }
}
```

This crossfades between frames for a softer preview. For true motion interpolation, generate more in-between frames or upgrade to a layered rig.

## React Component Example

```tsx
type CharacterId =
  | "teacher-guide"
  | "child-learner"
  | "teen-learner"
  | "parent-learner";

type AnimatedCharacterProps = {
  id: CharacterId;
  className?: string;
  decorative?: boolean;
};

export function AnimatedCharacter({
  id,
  className = "",
  decorative = true,
}: AnimatedCharacterProps) {
  const base = `/assets/images/characters/animations/${id}/frames`;

  return (
    <div
      className={`animated-character ${className}`}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${id} character animation`}
    >
      {[1, 2, 3, 4].map((frame) => (
        <img key={frame} src={`${base}/frame-${frame}.png`} alt="" />
      ))}
    </div>
  );
}
```

Use `decorative={false}` only if the character communicates something not already present in text.

## Manifest Loading

The top-level manifest can be used if the game wants to load characters dynamically:

```ts
type AnimationManifest = {
  characters: Array<{
    id: string;
    role: string;
    folder: string;
    manifest: string;
    frames: string[];
    spriteSheet: string;
  }>;
};
```

Recommended use:

```ts
const basePath = "/assets/images/characters/animations";
const frameUrls = character.frames.map((file) => `${basePath}/${file}`);
```

## When To Use These

Good uses:

```text
lesson intro
quiz correct/try-again feedback
streak or reward moment
listening exercise helper
family profile screen
```

Avoid using continuous animation next to dense reading, timed questions, or long explanations. In those contexts, pause after one loop or show `frame-1.png` as a static image.

## Performance Notes

- Preload the four frames for the current character before showing the animation.
- Use `loading="eager"` for above-the-fold character frames and `loading="lazy"` elsewhere.
- Keep rendered dimensions stable with fixed width/height or an aspect-ratio container.
- Respect reduced motion. If `prefers-reduced-motion: reduce` is active, show only `frame-1.png`.

Example:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-character img {
    animation: none;
  }

  .animated-character img:first-child {
    opacity: 1;
  }
}
```

## Sprite Sheet Alternative

If the game engine prefers sprite sheets, use each character's `sprite-sheet.png`. The frames are arranged horizontally in this order:

```text
neutral -> breathe -> gesture -> blink
```

The per-character `animation-manifest.json` includes crop boxes for the extracted frames. Use those values if you need atlas coordinates.

## Future Rig Upgrade

These assets are full-frame sprite animations, not true skeletal rigs. They are the best low-risk first step because the characters stay visually correct.

Upgrade to a true rig only if the game needs:

```text
interactive gaze tracking
many emotion states
dynamic arm gestures
lip-sync
runtime outfit or prop changes
```

For a true rig, regenerate each character as layered parts:

```text
body
head
eyes open/closed
mouth shapes
upper/lower arms
hands
props
shadow
```

Then animate those parts in Rive, Spine, DragonBones, or a custom React/CSS transform system.

## Source Notes

The current animation previews were generated from the approved character cutouts using built-in image generation, then converted from chroma-key sheets to transparent PNGs locally. Keep the original static character PNGs in:

```text
assets/images/characters/generated/
```

Those originals are the visual identity reference for future animation work.
