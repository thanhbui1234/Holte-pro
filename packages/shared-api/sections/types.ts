export interface SectionRecord {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE" | string;
  type?: "FIXED" | "CUSTOM" | string;
  data: {
    map: Record<string, unknown>;
    empty: boolean;
  };
  createdTime: number;
  updatedTime: number;
}

export interface CreateSectionRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  status?: string;
  data?: Record<string, unknown>;
}

export interface UpdateSectionRequest {
  id: number;
  name?: string;
  description?: string;
  displayOrder?: number;
  status?: string;
  data?: Record<string, unknown>;
}
