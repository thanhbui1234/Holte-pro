export interface CreateSupportFormRequest {
  phone: string;
  fullName: string;
  availableTime?: string;
  reason: string;
}

export interface CreateSupportFormResponse {
  supportFormId: number;
}
