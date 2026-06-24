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
  eyebrowColor: string;
  titlePrefix: string;
  titlePrefixColor: string;
  titleHighlight: string;
  titleHighlightColor: string;
  descriptionEn: string;
  descriptionEnColor: string;
  descriptionVi: string;
  descriptionViColor: string;
  pillars: string[];
  legacyLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
  backgroundColor: string;
}
