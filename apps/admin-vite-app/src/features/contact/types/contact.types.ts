export interface ContactCtaData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundColor: string;
}

export type ContactStatus = "PENDING" | "CONTACTED";

export interface SupportFormRecord {
  id: string | number; // Note: API returns Long, so it's likely number, but keeping string|number for safety
  phone: string;
  fullName: string;
  requesterEmail?: string;
  availableTime: string;
  reason: string;
  status: ContactStatus;
  supporter: string | null;
  createdTime: number;
  updatedTime: number;
}
