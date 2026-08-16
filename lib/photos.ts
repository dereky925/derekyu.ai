export type Photo = {
  src: string;
  width: number;
  height: number;
};

export type PhotoClip = {
  id: string;
  poster: string;
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

export const photoClips: PhotoClip[] = [
  { id: "27a9a8b4e0325d17f764a5e80bb853dd", poster: "/media/photo/clips/01.jpg" },
  { id: "33d2c4773bbb70b043025177e7773086", poster: "/media/photo/clips/02.jpg" },
  { id: "efddb4367698104830d393ad0c654d4b", poster: "/media/photo/clips/03.jpg" },
  { id: "9486b20bf26ff0e249cb4e743deb2902", poster: "/media/photo/clips/04.jpg" },
  { id: "c4a80b42a8ea18a795115f4cf7fe833c", poster: "/media/photo/clips/05.jpg" },
  { id: "bfdb257f6a8a7e8646e40427c3d77925", poster: "/media/photo/clips/06.jpg" },
  { id: "15e32f09c6385988506be7c2f514970e", poster: "/media/photo/clips/07.jpg" },
  { id: "ecf971ff2f2f65257304299bac24bb2e", poster: "/media/photo/clips/08.jpg" },
  { id: "6e8d94b5959866ed3e32640ce44a1e63", poster: "/media/photo/clips/09.jpg" },
  { id: "cdc34dc66c3973aa93101b052f724a81", poster: "/media/photo/clips/10.jpg" },
];

export const featuredPhotos = [photos[0]!, photos[9]!, photos[15]!] as const;

