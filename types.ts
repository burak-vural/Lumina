
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: string;
  image: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO string (YYYY-MM-DD)
  time: string; // HH:mm
  status: 'pending' | 'confirmed' | 'cancelled';
  reminderSent?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface SiteSettings {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  logoUrl: string;
  startHour: number;
  endHour: number;
  successMessage: string;
  contactPhone: string;
}

export type ViewState = 'home' | 'booking' | 'admin' | 'my-appointments' | 'success';
