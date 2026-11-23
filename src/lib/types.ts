// Shapes returned by the API, shared by stores and components.
export type LodgingType = "hotel" | "inn" | "pension";

export interface LodgingCard {
  id: number; slug: string; name: string; type: LodgingType; city: string; tagline: string | null;
  isPublished: boolean; coverUrl: string; fromPrice: number | null; rating: number | null; reviewCount: number;
}

export interface Lodging {
  id: number; slug: string; name: string; type: LodgingType; city: string; address: string; tagline: string | null;
  description: string; amenities: string[]; checkInTime: string; checkOutTime: string; isPublished: boolean;
}

export interface LodgingImage { id: number; url: string; alt: string; isCover: boolean }

export interface RoomType {
  id: number; lodgingId: number; name: string; description: string; bed: string; sizeSqm: number;
  maxPersons: number; pricePerNight: number; imageUrl: string; roomCount: number;
}

export interface Room { id: number; number: string; floor: number; roomTypeId?: number; roomTypeName?: string }

export interface Review { id: number; title: string; rating: number; comment: string; createdAt: string; author: string }

export interface Quote {
  roomTypeName: string; pricePerNight: number; nights: number; subtotal: number; discountAmount: number;
  total: number; discountCode: string | null; percentOff: number;
}

export interface Booking {
  id: number; reference: string; checkIn: string; checkOut: string; adults: number; children: number;
  guestName: string; contactNumber: string; subtotal: number; discountAmount: number; discountCode: string | null;
  total: number; status: "active" | "cancelled" | "completed"; createdAt: string; roomNumber: string; roomTypeName: string;
  lodgingId: number; lodgingName: string; lodgingSlug: string; lodgingType: LodgingType; city: string; guestEmail: string;
  payment?: { method: string; mockReference: string; amount: number } | null;
}

export interface Discount { id: number; code: string; percentOff: number; description: string }

export interface AdminStats { lodgings: number; rooms: number; activeBookings: number; guests: number; revenue: number }
