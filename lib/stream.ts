import { STREAM_CUSTOMER } from "@/lib/photos";

export const streamClips = {
  anduril: "54a4ecdb01369a03dea5d1a43b5139a1",
  northrop: "ff2c4a529d9aac18b5dc7509b5a25ae8",
  grokeye: "644b9bc822bc50f3d8c70801f5f4f938",
  hunter: "f84d2847c975d5cf2e589a73190375b3",
  mars: "f34123e37124cff39ccc26c14da2d6ff",
} as const;

/** Pixel aspect of the uploaded file (Mars is 2160×1080 / 2:1). */
export const streamClipAspect: Record<string, number> = {
  [streamClips.mars]: 2160 / 1080,
};

export const grokeyeYouTube = "https://www.youtube.com/watch?v=lC4oP8kb9KE";
export const hunterYouTube = "https://www.youtube.com/watch?v=nB1vAQlGqa4";

export function streamPoster(id: string) {
  const src = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg`;
  if (!streamClipAspect[id]) return src;
  return `${src}?width=1920&height=1080&fit=crop`;
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
