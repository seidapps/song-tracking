import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const content = readFileSync(join(__dirname, './tempo.config.json'), 'utf8');
  JSON.parse(content);
  console.log('JSON is valid');
} catch (error) {
  console.error('JSON Error:', error.message);
} 