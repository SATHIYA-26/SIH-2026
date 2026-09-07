import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';

/**
 * Returns a guaranteed valid leaf image URL.
 * If the input URL is empty, undefined, or broken, provides an appropriate fallback based on status.
 */
export function getValidLeafImageUrl(imageUrl?: string | null, statusText?: string): string {
  if (imageUrl && imageUrl.trim().length > 5 && !imageUrl.includes('undefined') && !imageUrl.includes('null')) {
    return imageUrl;
  }

  const s = (statusText || '').toLowerCase();
  if (s.includes('healthy') || s.includes('stabilized') || s.includes('improving') || s.includes('fine') || s.includes('normal')) {
    return COTTON_LEAF_HEALTHY_IMAGE;
  }

  return COTTON_LEAF_BACTERIAL_IMAGE;
}

/**
 * Image error handler that replaces a broken image source with a working fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = COTTON_LEAF_BACTERIAL_IMAGE
): void {
  const target = event.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
