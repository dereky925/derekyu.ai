import { STREAM_CUSTOMER } from "@/lib/photos";

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
