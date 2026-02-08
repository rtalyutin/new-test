import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ASSET_DIRECTORIES = ['public/logos', 'public/media/hero'];
const ASSET_FILE_NAME_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(jpg|jpeg|png|svg|webp|gif|avif)$/;

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }

      return [fullPath];
    })
  );

  return nestedFiles.flat();
};

const validateAssets = async () => {
  const invalidFiles = [];

  for (const directory of ASSET_DIRECTORIES) {
    const files = await collectFiles(directory);

    for (const filePath of files) {
      const fileName = path.basename(filePath);

      if (!ASSET_FILE_NAME_REGEX.test(fileName)) {
        invalidFiles.push(filePath);
      }
    }
  }

  if (invalidFiles.length) {
    console.error('Найдены ассеты с невалидными именами:');
    invalidFiles.forEach((filePath) => console.error(`- ${filePath}`));
    process.exitCode = 1;
    return;
  }

  console.log('Имена ассетов валидны.');
};

await validateAssets();
