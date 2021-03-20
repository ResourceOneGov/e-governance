export interface News {
  isImage: boolean;
  title?: string;
  content?: string;
  images: string[];
}

export interface NewsResponse {
  _id: string;
  title?: string;
  content?: string;
  images: string[];
  addedOn: string;
}