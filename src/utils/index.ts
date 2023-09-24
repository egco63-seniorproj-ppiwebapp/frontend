import { ImageMetadata, ImageThumbnailData } from "@/types";

export function parseImageMetadata(imgMeta: ImageMetadata) {
  const { id, name, side } = imgMeta;
  let { stat } = imgMeta;

  stat = stat == null ? "U" : stat;
  const StatEnum: Record<string, string> = {
    U: "Unlabel",
    N: "Normal",
    H: "High",
    F: "Flat",
  };
  const SideEnum: Record<string, string> = {
    L: "Left",
    R: "Right",
  };

  const tags = [];
  if (side) tags.push(SideEnum[side]);
  if (stat) tags.push(StatEnum[stat]);

  const imgData: ImageThumbnailData = {
    id,
    name,
    img: `/img/${id}`,
    tags: tags,
  };
  return imgData;
}
