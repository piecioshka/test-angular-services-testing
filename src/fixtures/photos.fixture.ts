import { Photos } from "src/app/photos.interface";

export function photosFactory(): Photos {
  return Object.freeze([
    { id: "q1w2", photoUrl: "https://example.org/1" },
    { id: "e3r4", photoUrl: "https://example.org/2" },
    { id: "t5y6", photoUrl: "https://example.org/3" },
  ]) as Photos;
}
