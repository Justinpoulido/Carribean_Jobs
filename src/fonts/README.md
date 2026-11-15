# Fonts

Self-hosted variable fonts, so the build makes no network request to Google and
visitors' browsers make none either.

| File | Family | Weights | Licence |
| --- | --- | --- | --- |
| `inter-variable.woff2` | Inter | 100–900 (variable) | SIL OFL 1.1 — `Inter-LICENSE.txt` |
| `space-grotesk-variable.woff2` | Space Grotesk | 300–700 (variable) | SIL OFL 1.1 — `SpaceGrotesk-LICENSE.txt` |

Both files are the `latin` subsets taken from the `@fontsource-variable`
packages. They are wired up in `src/app/layout.tsx` with `next/font/local`,
which exposes them as the `--font-inter` and `--font-space-grotesk` CSS
variables consumed by the `@theme` block in `src/app/globals.css`.
