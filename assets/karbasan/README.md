# Karbasan runtime art

These PNGs are bundled locally. `src/ui/karbasan/sprites.ts` maps unchanged source pixels to native clipping rectangles. No complete screen is used as an interactive replacement.

The ore sheets are the approved references in `design/karbasan/reference/`. Skin, icons, jewelry, material outputs, NPCs, services, workshops, brand, background and map come from `design/karbasan/production/`. `rare.png` contains both Karataş and Kızıltaş. Verit uses the approved exotic exploration's upper row.

Two additional Imagegen assets complete runtime needs:

- `gems.png`: three separate unmounted faceted pear gemstones, emerald green / ruby red / amethyst purple, matching the approved fantasy jewelry rendering, generous transparent spacing, no lettering or jewelry setting.
- `app-icon.png`: opaque square iOS app icon using the selected C gemstone KP direction, jade K / iris violet P, snowy cream stone frame, large centered readable initials, no extra text.

The icon is generated raster artwork; iOS applies its system icon mask. Source sheets and generated assets remain reviewable in Git. Asset color and silhouette changes require visual review against the approved family references.

`jewelry-corrections-v1.png` corrects the plain iron ring, iron/ruby bracelet, Blackrock/amethyst amulet and Bloodrock/ruby crown. See [the exact final prompt and validation](JEWELRY_PROMPT.md).
