
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

const OUT_DIR = resolve(process.cwd(), 'src/svgs');
const BASE_URL =
  'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

async function confirmOverwrite(filePath: string): Promise<boolean> {
  const exists = await fileExists(filePath);

  if (!exists) {
    return true;
  }

  const readline = createInterface({ input: stdin, output: stdout });

  try {
    const answer = await readline.question(
      `Icon already exists. Replace it? (y/N): `,
    );

    return ['y', 'yes'].includes(answer.trim().toLowerCase());
  } finally {
    readline.close();
  }
}

async function downloadIcon(iconName: string): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName)) {
    throw new Error(`Invalid icon name: "${iconName}"`);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const outputPath = resolve(OUT_DIR, `${iconName}.svg`);

  if (!(await confirmOverwrite(outputPath))) {
    console.log('Download cancelled.');
    return;
  }

  const url = `${BASE_URL}/${iconName}.svg`;

  console.log(`Downloading icon: ${iconName}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download "${iconName}": ${response.status} ${response.statusText}`,
    );
  }

  const svg = await response.text();

  if (!svg.trimStart().startsWith('<svg')) {
    throw new Error(`Invalid SVG resource for "${iconName}".`);
  }

  await writeFile(outputPath, svg, 'utf-8');

  console.log(`Successfully saved: ${outputPath}`);
}

const iconName = process.argv[2];

if (!iconName) {
  console.error('Usage: pnpm download:icon <iconName>');
  process.exitCode = 1;
} else {
  downloadIcon(iconName).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
