/**
 * Utilitas pengembangan: merender file SVG menjadi PNG agar desain
 * ornamen dapat diperiksa secara visual tanpa membuka browser.
 *
 *   node scripts/render-svg.mjs <input.svg> <output.png> [width]
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const [, , input, output, widthArg] = process.argv;
if (!input || !output) {
  console.error('Usage: node scripts/render-svg.mjs <input.svg> <output.png> [width]');
  process.exit(1);
}

const width = Number(widthArg ?? 900);
const svg = readFileSync(input);

await sharp(Buffer.from(svg), { density: 200 })
  .resize({ width })
  .png()
  .toFile(output);

console.log(`rendered ${input} -> ${output} (${width}px wide)`);
