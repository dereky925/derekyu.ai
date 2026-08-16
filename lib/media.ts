const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Resolve a media path.
 * - Absolute http(s) URLs pass through (Mux, YouTube thumbs, R2 public URLs).
 * - Paths starting with `/` stay on this origin (optimized stills in /public).
 * - Everything else is joined to NEXT_PUBLIC_MEDIA_BASE_URL when set (R2 / CDN keys).
 */
export function mediaUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  if (mediaBase) {
    return `${mediaBase}/${path.replace(/^\//, "")}`;
  }
  return `/${path}`;
}

export function muxPoster(playbackId: string, time = 1) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}&width=1600`;
}

export function muxMp4(playbackId: string) {
  return `https://stream.mux.com/${playbackId}/capped-1080p.mp4`;
}

export const remoteImageHosts = [
  "image.mux.com",
  "stream.mux.com",
  "img.youtube.com",
  "i.ytimg.com",
  "media.derekyu.ai",
  "imagedelivery.net",
] as const;
