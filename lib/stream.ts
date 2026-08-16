import { STREAM_CUSTOMER } from "@/lib/photos";

export const streamClips = {
  anduril: "54a4ecdb01369a03dea5d1a43b5139a1",
  northrop: "ff2c4a529d9aac18b5dc7509b5a25ae8",
  grokeye: "644b9bc822bc50f3d8c70801f5f4f938",
  hunter: "f84d2847c975d5cf2e589a73190375b3",
  mars: "8a6f9f54e141af9e1134927570ac894a",
} as const;

/** Pixel aspect of the uploaded file (Stream kept 1664×1080 for Mars). */
export const streamClipAspect: Partial<Record<(typeof streamClips)[keyof typeof streamClips], number>> =
  {
    [streamClips.mars]: 1664 / 1080,
  };

export const grokeyeYouTube = "https://www.youtube.com/watch?v=lC4oP8kb9KE";
export const hunterYouTube = "https://www.youtube.com/watch?v=nB1vAQlGqa4";

export function streamPoster(id: string) {
  const src = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg`;
  const aspect = streamClipAspect[id as keyof typeof streamClipAspect];
  if (!aspect) return src;
  const height = 1080;
  return `${src}?width=${Math.round(height * aspect)}&height=${height}`;
}

export function streamHlsSrc(id: string) {
  return `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/manifest/video.m3u8`;
}

export function streamIframeSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "true",
    muted: "true",
    loop: "true",
    controls: "false",
    preload: "auto",
    letterboxColor: "#050505",
  });
  return `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/iframe?${params.toString()}`;
}

export function streamWatchSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "true",
    preload: "auto",
    letterboxColor: "#050505",
  });
  return `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/iframe?${params.toString()}`;
}
