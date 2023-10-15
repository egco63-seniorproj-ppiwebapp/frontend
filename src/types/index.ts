export interface ImageThumbnailData {
  id: number;
  name: string;
  tags: string[];
  img: string;
}

export interface SearchParameters {
  name: string;
  sortby: string;
  ascending: boolean;
  footside: string;
  footlabel: string | string[];
}

export interface ImageMetadata {
  id: number;
  name: string;
  link: string;
  stat: string | null;
  side: string | null;
  deleted: boolean;
  created_date: string;
  deleted_date: string | null;
  modify_date: string;
  remark: string | null;
}

export interface AuthData {
  username: string;
  password: string;
}
