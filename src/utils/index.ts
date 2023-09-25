import { ImageMetadata, ImageThumbnailData } from "@/types";
import axios, { AxiosResponse } from "axios";

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

export async function handleAxiosResponse(
  axiosRequestFunction: () => Promise<AxiosResponse>
) {
  let res: AxiosResponse;
  try {
    res = await axiosRequestFunction();
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    if (!err.response) throw err;
    res = err.response;
  }
  return res;
}
