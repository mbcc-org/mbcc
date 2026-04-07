const IMAGE_BASE_URL = import.meta.env.PUBLIC_IMAGE_BASE_URL || "";

export function getImageUrl(
  path: string,
  options?: { width?: number; height?: number },
): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;

  // Dev fallback: use Picsum with seeded URLs for consistent images
  if (!IMAGE_BASE_URL) {
    const w = options?.width || 800;
    const h = options?.height || 600;
    const seed = path.replace(/[^a-zA-Z0-9]/g, "-");
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  }

  // Production: prepend R2 base URL
  // Supports Cloudflare Image Resizing params if needed
  const base = IMAGE_BASE_URL.replace(/\/$/, "");
  return `${base}/${path}`;
}
