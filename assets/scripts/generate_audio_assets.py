from __future__ import annotations

import math
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SAMPLE_RATE = 44100


def envelope(t: float, duration: float, attack: float = 0.025, release: float = 0.08) -> float:
    if t < attack:
        return t / attack
    if t > duration - release:
        return max(0.0, (duration - t) / release)
    return 1.0


def sine(freq: float, t: float) -> float:
    return math.sin(2 * math.pi * freq * t)


def soft_clip(value: float) -> float:
    return math.tanh(value * 1.15)


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for sample in samples:
            sample = max(-1.0, min(1.0, sample))
            frames.extend(int(sample * 32767).to_bytes(2, "little", signed=True))
        wav.writeframes(frames)


def tone(duration: float, freqs: list[float], volume: float = 0.35) -> list[float]:
    total = int(duration * SAMPLE_RATE)
    out: list[float] = []
    for i in range(total):
        t = i / SAMPLE_RATE
        signal = sum(sine(freq, t) for freq in freqs) / len(freqs)
        out.append(soft_clip(signal * envelope(t, duration) * volume))
    return out


def sequence(notes: list[tuple[float, float]], volume: float = 0.34, gap: float = 0.025) -> list[float]:
    out: list[float] = []
    silence = [0.0] * int(gap * SAMPLE_RATE)
    for freq, duration in notes:
        out.extend(tone(duration, [freq, freq * 2], volume))
        out.extend(silence)
    return out


def shimmer(duration: float, base: float, volume: float = 0.22) -> list[float]:
    total = int(duration * SAMPLE_RATE)
    out: list[float] = []
    for i in range(total):
        t = i / SAMPLE_RATE
        sweep = base + 120 * t
        signal = sine(sweep, t) * 0.65 + sine(sweep * 1.5, t) * 0.25 + sine(sweep * 2, t) * 0.1
        out.append(soft_clip(signal * envelope(t, duration, 0.02, 0.18) * volume))
    return out


def gentle_noise_click(duration: float = 0.12, volume: float = 0.16) -> list[float]:
    total = int(duration * SAMPLE_RATE)
    out: list[float] = []
    seed = 1234567
    for i in range(total):
        t = i / SAMPLE_RATE
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
        noise = ((seed / 0x7FFFFFFF) * 2 - 1) * 0.25
        signal = sine(720, t) * 0.75 + noise
        out.append(soft_clip(signal * envelope(t, duration, 0.004, 0.06) * volume))
    return out


def music_loop(chords: list[list[float]], duration: float, volume: float = 0.18) -> list[float]:
    total = int(duration * SAMPLE_RATE)
    out: list[float] = []
    chord_span = duration / len(chords)
    for i in range(total):
        t = i / SAMPLE_RATE
        chord = chords[min(len(chords) - 1, int(t / chord_span))]
        local = t % chord_span
        pad = sum(sine(freq, t) + 0.45 * sine(freq * 2, t) for freq in chord) / (len(chord) * 1.45)
        pulse = 0.65 + 0.35 * math.sin(2 * math.pi * 1.5 * local) ** 2
        melody = 0.0
        if int(t * 2) % 4 in (1, 3):
            melody = 0.18 * sine(chord[-1] * 2, t)
        loop_env = min(1.0, t / 0.25, (duration - t) / 0.25)
        out.append(soft_clip((pad * pulse + melody) * volume * loop_env))
    return out


def main() -> None:
    sfx = ROOT / "audio" / "sfx"
    music = ROOT / "audio" / "music"

    write_wav(sfx / "tap_soft.wav", gentle_noise_click())
    write_wav(sfx / "card_flip.wav", shimmer(0.22, 360, 0.18))
    write_wav(sfx / "correct_soft.wav", sequence([(523.25, 0.13), (659.25, 0.15), (783.99, 0.22)], 0.28))
    write_wav(sfx / "incorrect_gentle.wav", sequence([(392.0, 0.14), (329.63, 0.22)], 0.18))
    write_wav(sfx / "pronunciation_ping.wav", sequence([(440.0, 0.08), (880.0, 0.12)], 0.22, 0.015))
    write_wav(sfx / "streak_sparkle.wav", sequence([(659.25, 0.08), (783.99, 0.08), (987.77, 0.12), (1174.66, 0.2)], 0.24, 0.02))
    write_wav(sfx / "level_complete.wav", sequence([(523.25, 0.12), (659.25, 0.12), (783.99, 0.12), (1046.5, 0.36)], 0.27, 0.025))

    write_wav(
        music / "focus_loop.wav",
        music_loop([[261.63, 329.63, 392.0], [293.66, 349.23, 440.0], [246.94, 329.63, 392.0], [261.63, 329.63, 392.0]], 16.0, 0.14),
    )
    write_wav(
        music / "warm_welcome_loop.wav",
        music_loop([[349.23, 440.0, 523.25], [392.0, 493.88, 587.33], [329.63, 392.0, 493.88], [349.23, 440.0, 523.25]], 14.0, 0.15),
    )
    write_wav(
        music / "celebration_loop.wav",
        music_loop([[523.25, 659.25, 783.99], [587.33, 739.99, 880.0], [493.88, 659.25, 783.99], [523.25, 659.25, 1046.5]], 10.0, 0.16),
    )


if __name__ == "__main__":
    main()

