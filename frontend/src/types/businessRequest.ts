export interface DocumentItem {
  name: string;
  icon?: string; // optional, can be SVG string or similar
}

export interface BusinessRequest {
  id: string | number;
  businessId?: number;
  userId?: string;
  name: string;
  serviceType: string;
  owner: string;
  email: string;
  contact: string;
  location: string;
  pan: string;
  submitted: string;
  description: string;
  documents: DocumentItem[];
}
