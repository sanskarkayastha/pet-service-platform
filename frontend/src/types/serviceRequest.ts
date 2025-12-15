export interface ServiceRequest {
  id: number;
  businessId: number;       // ID of the business making the request
  businessName: string;
  owner: string;            // Owner’s name
  location: string;
  existingServices: string[];
  requestedService: string; // The new service being requested
  submitted: string;        // Date of request
  reason: string;           // Why the business wants this service
}
