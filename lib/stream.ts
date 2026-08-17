import { STREAM_CUSTOMER } from "@/lib/photos";

export const streamClips = {
  anduril: "54a4ecdb01369a03dea5d1a43b5139a1",
  northrop: "ff2c4a529d9aac18b5dc7509b5a25ae8",
  grokeye: "644b9bc822bc50f3d8c70801f5f4f938",
  hunter: "f84d2847c975d5cf2e589a73190375b3",
  mars: "f34123e37124cff39ccc26c14da2d6ff",
  boat: "6cef76dbec3690e32ee8cf6b10450860",
  talentgrok: "521456d26280d9a6486fead44b9279f5",
  flappyfury: "87a465c5c56e2814ac2801a91ff25bd5",
  claudecode: "8cc9a4c0d120f78732ad70649d965c57",
} as const;

/** Pixel aspect of the uploaded file (Mars is 2160×1080 / 2:1). */
export const streamClipAspect: Record<string, number> = {
  [streamClips.mars]: 2160 / 1080,
  [streamClips.claudecode]: 1920 / 1440,
};

/** Thumbnail loops skip the opening of these clips (seconds). */
export const streamClipStart: Record<string, number> = {
  [streamClips.grokeye]: 12,
  [streamClips.mars]: 10,
  [streamClips.hunter]: 6,
};

export const grokeyeYouTube = "https://www.youtube.com/watch?v=lC4oP8kb9KE";
export const hunterYouTube = "https://www.youtube.com/watch?v=nB1vAQlGqa4";
export const talentGrokYouTube =
  "https://www.youtube.com/watch?v=r3_mI0W5Xk4";

export function streamPoster(id: string) {
  const src = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg`;
  const start = streamClipStart[id];
  return start ? `${src}?time=${start}s` : src;
}

export function streamHlsSrc(id: string) {
  const src = `https://${STREAM_CUSTOMER}.cloudflarestream.com/${id}/manifest/video.m3u8`;
  const start = streamClipStart[id];
  return start ? `${src}#t=${start}` : src;
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
  const start = streamClipStart[id];
  if (start) params.set("startTime", String(start));
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
