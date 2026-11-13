import { shareImage, shareSize } from "@/lib/share-image";

export const alt = "Caribbean Jobs";
export const size = shareSize;
export const contentType = "image/png";

export default function Image() {
  return shareImage(
    "Find jobs across the Caribbean",
    "Caribbean Jobs",
    "carribeanjobs.online",
  );
}
