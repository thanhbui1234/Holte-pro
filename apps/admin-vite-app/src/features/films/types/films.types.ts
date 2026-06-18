export interface FilmPreviewImage {
  src: string;
  title: string;
  topic: string;
  description: string;
  attribute: string;
}

export interface FilmItem {
  id: string;
  youtubeUrl: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  previewImages: FilmPreviewImage[];
}
