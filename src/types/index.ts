export interface ImageData {
  name: string;
  tags: string[];
  img: string;
}

export interface SearchParameters {
  name: string;
  sortby: string;
  sortorder: boolean;
  footside: string;
  footlabel: string;
}
