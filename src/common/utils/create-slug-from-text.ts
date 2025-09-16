import { slugify } from './slugify';

export function createSlugFromText(text: string) {
  const slug = slugify(text);
  return `${slug}-${generateRandomSuffix()}`;
}

function generateRandomSuffix() {
  return Math.random().toString(36).substring(2, 8);
}
