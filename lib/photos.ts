export type Photo = {
  src: string;
  width: number;
  height: number;
};

export type PhotoClip = {
  id: string;
  poster: string;
  title: string;
  location: string;
  year: number;
  month: number | null;
};

export const STREAM_CUSTOMER =
  "customer-ujeel072i6bo0c62";

export const photos: Photo[] = [
  { src: "/media/photo/01.jpg", width: 1436, height: 757 },
  { src: "/media/photo/02.jpg", width: 1011, height: 757 },
  { src: "/media/photo/03.jpg", width: 1436, height: 757 },
  { src: "/media/photo/04.jpg", width: 1436, height: 757 },
  { src: "/media/photo/05.jpg", width: 1011, height: 757 },
  { src: "/media/photo/06.jpg", width: 1436, height: 757 },
  { src: "/media/photo/07.jpg", width: 1436, height: 757 },
  { src: "/media/photo/08.jpg", width: 1012, height: 757 },
  { src: "/media/photo/09.jpg", width: 1436, height: 757 },
  { src: "/media/photo/10.jpg", width: 1292, height: 967 },
  { src: "/media/photo/11.jpg", width: 1290, height: 967 },
  { src: "/media/photo/12.jpg", width: 1292, height: 967 },
  { src: "/media/photo/13.jpg", width: 1292, height: 967 },
  { src: "/media/photo/14.jpg", width: 1292, height: 967 },
  { src: "/media/photo/15.jpg", width: 1292, height: 967 },
  { src: "/media/photo/16.jpg", width: 1292, height: 967 },
  { src: "/media/photo/17.jpg", width: 1292, height: 967 },
  { src: "/media/photo/18.jpg", width: 1292, height: 967 },
  { src: "/media/photo/19.jpg", width: 1292, height: 967 },
  { src: "/media/photo/20.jpg", width: 1291, height: 967 },
  { src: "/media/photo/21.jpg", width: 1292, height: 967 },
  { src: "/media/photo/22.jpg", width: 1292, height: 967 },
  { src: "/media/photo/23.jpg", width: 1292, height: 967 },
  { src: "/media/photo/24.jpg", width: 1292, height: 967 },
  { src: "/media/photo/25.jpg", width: 1291, height: 967 },
  { src: "/media/photo/26.jpg", width: 1292, height: 967 },
  { src: "/media/photo/27.jpg", width: 1292, height: 967 },
  { src: "/media/photo/28.jpg", width: 1292, height: 967 },
  { src: "/media/photo/29.jpg", width: 1290, height: 967 },
  { src: "/media/photo/30.jpg", width: 1292, height: 967 },
  { src: "/media/photo/31.jpg", width: 1292, height: 967 },
  { src: "/media/photo/32.jpg", width: 1292, height: 967 },
  { src: "/media/photo/33.jpg", width: 1294, height: 967 },
  { src: "/media/photo/34.jpg", width: 1291, height: 967 },
  { src: "/media/photo/35.jpg", width: 1291, height: 967 },
  { src: "/media/photo/36.jpg", width: 1291, height: 967 },
  { src: "/media/photo/37.jpg", width: 1291, height: 967 },
  { src: "/media/photo/38.jpg", width: 1291, height: 967 },
  { src: "/media/photo/39.jpg", width: 1291, height: 967 },
  { src: "/media/photo/40.jpg", width: 1292, height: 967 },
  { src: "/media/photo/41.jpg", width: 1292, height: 967 },
  { src: "/media/photo/42.jpg", width: 1292, height: 967 },
];

const clipPosters: Record<string, string> = {
  "27a9a8b4e0325d17f764a5e80bb853dd": "/media/photo/clips/01.jpg",
  "33d2c4773bbb70b043025177e7773086": "/media/photo/clips/02.jpg",
  "efddb4367698104830d393ad0c654d4b": "/media/photo/clips/03.jpg",
  "9486b20bf26ff0e249cb4e743deb2902": "/media/photo/clips/04.jpg",
  "c4a80b42a8ea18a795115f4cf7fe833c": "/media/photo/clips/05.jpg",
  "bfdb257f6a8a7e8646e40427c3d77925": "/media/photo/clips/06.jpg",
  "15e32f09c6385988506be7c2f514970e": "/media/photo/clips/07.jpg",
  "ecf971ff2f2f65257304299bac24bb2e": "/media/photo/clips/08.jpg",
  "6e8d94b5959866ed3e32640ce44a1e63": "/media/photo/clips/09.jpg",
  "cdc34dc66c3973aa93101b052f724a81": "/media/photo/clips/10.jpg",
};

export const photoClips: PhotoClip[] = [
  {
    id: "27a9a8b4e0325d17f764a5e80bb853dd",
    poster: clipPosters["27a9a8b4e0325d17f764a5e80bb853dd"]!,
    title: "Grand Canyon",
    location: "Grand Canyon, Arizona",
    year: 2025,
    month: null,
  },
  {
    id: "33d2c4773bbb70b043025177e7773086",
    poster: clipPosters["33d2c4773bbb70b043025177e7773086"]!,
    title: "Sedona",
    location: "Sedona, Arizona",
    year: 2025,
    month: null,
  },
  {
    id: "bfdb257f6a8a7e8646e40427c3d77925",
    poster: clipPosters["bfdb257f6a8a7e8646e40427c3d77925"]!,
    title: "Sedona",
    location: "Sedona, Arizona",
    year: 2025,
    month: null,
  },
  {
    id: "9486b20bf26ff0e249cb4e743deb2902",
    poster: clipPosters["9486b20bf26ff0e249cb4e743deb2902"]!,
    title: "Scottsdale",
    location: "Scottsdale, Arizona",
    year: 2025,
    month: null,
  },
  {
    id: "15e32f09c6385988506be7c2f514970e",
    poster: clipPosters["15e32f09c6385988506be7c2f514970e"]!,
    title: "Chandler night",
    location: "Chandler, Arizona",
    year: 2025,
    month: null,
  },
  {
    id: "c4a80b42a8ea18a795115f4cf7fe833c",
    poster: clipPosters["c4a80b42a8ea18a795115f4cf7fe833c"]!,
    title: "Cantera Pool",
    location: "Cantera",
    year: 2025,
    month: null,
  },
  {
    id: "efddb4367698104830d393ad0c654d4b",
    poster: clipPosters["efddb4367698104830d393ad0c654d4b"]!,
    title: "Los Angeles",
    location: "Los Angeles, California",
    year: 2025,
    month: null,
  },
  {
    id: "ecf971ff2f2f65257304299bac24bb2e",
    poster: clipPosters["ecf971ff2f2f65257304299bac24bb2e"]!,
    title: "LA fireworks",
    location: "Los Angeles, California",
    year: 2025,
    month: 7,
  },
  {
    id: "6e8d94b5959866ed3e32640ce44a1e63",
    poster: clipPosters["6e8d94b5959866ed3e32640ce44a1e63"]!,
    title: "Crystal Cove",
    location: "Crystal Cove, California",
    year: 2025,
    month: null,
  },
  {
    id: "cdc34dc66c3973aa93101b052f724a81",
    poster: clipPosters["cdc34dc66c3973aa93101b052f724a81"]!,
    title: "San Diego",
    location: "San Diego, California",
    year: 2025,
    month: null,
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function clipDateLabel(clip: PhotoClip) {
  if (clip.month) {
    return `${monthNames[clip.month - 1]} ${clip.year}`;
  }
  return String(clip.year);
}

export const featuredPhotos = [photos[0]!, photos[9]!, photos[15]!] as const;
