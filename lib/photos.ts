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

export function clipDateLabel(item: {
  year: number | null;
  month: number | null;
}) {
  if (!item.year) return "";
  if (item.month) {
    return `${monthNames[item.month - 1]} ${item.year}`;
  }
  return String(item.year);
}

/** State / rest of the location, without repeating the title. */
export function clipPlaceDetail(clip: Pick<PhotoClip, "title" | "location">) {
  const title = clip.title.trim();
  const location = clip.location.trim();
  if (!location || location.toLowerCase() === title.toLowerCase()) return "";
  if (title && location.toLowerCase().startsWith(`${title.toLowerCase()},`)) {
    return location.slice(title.length).replace(/^,\s*/, "");
  }
  return location;
}
