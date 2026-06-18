export interface AboutImage {
  src: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  descriptionEn: string;
  descriptionVi: string;
  pillars: string[];
  legacyLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
  backgroundColor: string;
}
