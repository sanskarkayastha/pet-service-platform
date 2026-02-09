import { Scissors, Hotel, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CompanyType = "grooming" | "petHostel" | "vet";

export interface ServiceConfig {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICE_CONFIG: Record<CompanyType, ServiceConfig> = {
  grooming: {
    title: "Grooming Service",
    description: "Manage grooming appointments and services",
    icon: Scissors,
  },
  petHostel: {
    title: "Pet Hostel Service",
    description: "Manage pet boarding and hostel services",
    icon: Hotel,
  },
  vet: {
    title: "Veterinary Service",
    description: "Manage vet appointments and treatments",
    icon: Stethoscope,
  },
};
