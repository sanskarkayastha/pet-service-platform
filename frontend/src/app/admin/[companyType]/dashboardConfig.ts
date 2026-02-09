import { CompanyType } from "./config";

export interface StatCard {
  label: string;
  value: string;
  change: string;
  type: "purple" | "orange" | "green";
}

export interface Booking {
  id: string;
  status: string;
  price: string;
  customer: string;
  pet?: string;
  service: string;
  dateTime: string;
}

interface DashboardConfig {
  title: string;
  description: string;
  stats: StatCard[];
  bookings: Booking[];
}

export const DASHBOARD_CONFIG: Record<CompanyType, DashboardConfig> = {
  grooming: {
    title: "Grooming Service",
    description: "Manage grooming appointments and services",
    stats: [
      {
        label: "Today's Booking",
        value: "8",
        change: "+7 from Yesterday",
        type: "purple",
      },
      {
        label: "Pending",
        value: "5",
        change: "Needs approval",
        type: "orange",
      },
      {
        label: "Revenue Today",
        value: "₹12,500",
        change: "+From 8 bookings",
        type: "green",
      },
    ],
    bookings: [
      {
        id: "GRO01",
        status: "confirmed",
        price: "Rs 15000",
        customer: "John Doe",
        pet: "Max (Golden Retriever)",
        service: "Full Grooming",
        dateTime: "2025-10-30, 10:00AM",
      },
    ],
  },

  petHostel: {
    title: "Pet Hostel Service",
    description: "Manage pet boarding and stay services",
    stats: [
      {
        label: "Pets Checked In",
        value: "12",
        change: "+3 today",
        type: "purple",
      },
      {
        label: "Pending Check-ins",
        value: "4",
        change: "Awaiting approval",
        type: "orange",
      },
      {
        label: "Revenue Today",
        value: "₹18,000",
        change: "+From stays",
        type: "green",
      },
    ],
    bookings: [
      {
        id: "HOS01",
        status: "pending",
        price: "Rs 6000",
        customer: "Sita Sharma",
        pet: "Bruno (Labrador)",
        service: "3 Days Boarding",
        dateTime: "2025-10-30, 9:00AM",
      },
    ],
  },

  vet: {
    title: "Veterinary Service",
    description: "Manage vet appointments and treatments",
    stats: [
      {
        label: "Appointments Today",
        value: "10",
        change: "+2 from Yesterday",
        type: "purple",
      },
      {
        label: "Pending Reports",
        value: "3",
        change: "Lab results awaited",
        type: "orange",
      },
      {
        label: "Revenue Today",
        value: "₹9,500",
        change: "+Consultations",
        type: "green",
      },
    ],
    bookings: [
      {
        id: "VET01",
        status: "confirmed",
        price: "Rs 1200",
        customer: "Ram Thapa",
        pet: "Milo (Beagle)",
        service: "General Checkup",
        dateTime: "2025-10-30, 11:30AM",
      },
    ],
  },
};
