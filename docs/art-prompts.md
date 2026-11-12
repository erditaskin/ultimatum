# Üretim promptları

Araç: yerleşik Imagegen, CLI/API fallback kullanılmadı. Referans: `assets/brand/art-direction-approved.png`. Bunlar çalışma zamanında çağrılmaz.

## Şeffaf atlas — nihai üretim promptu

Use case: game sprite atlas production. Extract/re-render the approved visual assets from the reference as ONE SQUARE TRANSPARENT PNG texture atlas on an EXACT 5 COLUMN × 5 ROW UNIFORM GRID. No grid lines, headings, numerals, palette swatches, backgrounds, borders or panels. All unused pixels fully alpha transparent. Each cell has generous transparent padding; no asset crosses its assigned cells. Consistent object scale within cells, centered, complete silhouettes never clipped.

Grid coordinates are ZERO BASED. Layout is mandatory:
ROW 0: columns 0–3 together contain ONLY the wide approved "KatlaPatla!" wordmark, centered in this four-cell-wide region. Uppercase K hot pink, uppercase P neon lime green, immediately following a neon magenta; other letters preserve reference neon colors, violet outlines, no black/gray in wordmark. Column 4 contains the matching KP rounded-square icon: K hot pink, P lime green, pink/lilac backing.
ROW 1: five approved folded packet objects levels 1,2,3,4,5 in respective columns 0..4.
ROW 2: five approved green-to-hot-red chili pepper objects levels 1..5 in columns 0..4.
ROW 3: five approved graphite-to-polished-silver capsules levels 1..5 in columns 0..4, pink accent bands, no eyes/faces.
ROW 4: col0 approved pink/lilac paper-confetti explosion; col1 approved red/orange and green leaf pepper explosion; col2 approved silver/chrome cosmic burst with cyan/blue core and colorful shooting stars, NO PURPLE in this cosmic burst; col3 completely EMPTY transparent; col4 completely EMPTY transparent.

Keep the exact recognizable approved object silhouettes, materials, berry pink/purple packet colors, natural green/red pepper colors, progressively reflective gray capsules, the neon logo and clean polished 2.5D game illustration. ALL CELLS EQUAL SIZE. Objects fit within central 80% of each cell with small natural transparent shadow only. Wordmark fits central 95% of its four-cell region. Icon fits central 85% of its single cell. Transparent background, no labels or numbers whatsoever. This atlas will be displayed directly in a React Native game by grid cell coordinates, so accurate placement is essential. Square image, ideally 2048×2048.

## KP ikonu — nihai üretim promptu

Use case: logo-brand. Produce ONLY the approved KP application icon from the upper-right of this reference, as a standalone square full-bleed iOS app icon. Exact initials uppercase "KP", K hot neon pink and P contrasting neon lime/chartreuse green, same chunky rounded sculptural letters and vivid violet outline. Soft pink/lilac full-bleed background, subtle glossy dimensional highlights and tiny lime spark above P. Center initials very large with safe margin, readable at small size. Do NOT include the full wordmark, palette, objects, screenshot, border outside the icon, labels or other text. No black/gray letters. Square 1024x1024, opaque background extending to all corners; iOS will apply its own rounded mask. Match the approved icon's character exactly.
