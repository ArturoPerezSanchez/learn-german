# Audio Assets

These WAV files are generated from `assets/scripts/generate_audio_assets.py`.

## Design Goals

- Gentle attack and release to avoid sharp surprises.
- Short UI sounds under two seconds.
- Loopable music beds with simple warm harmony.
- Original synthesis, no external samples.

## Recommended Implementation Defaults

- SFX volume: 35-50%.
- Music volume: 12-20%.
- Add a visible mute toggle.
- Pause music when pronunciation recording starts.
- Respect browser autoplay restrictions by starting audio only after user interaction.

