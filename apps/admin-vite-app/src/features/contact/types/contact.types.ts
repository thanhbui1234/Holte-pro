export interface ContactCtaData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundColor: string;
}

export type ContactStatus = "new" | "read" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  weddingDate: string;
  message: string;
  status: ContactStatus;
  receivedAt: number;
}
