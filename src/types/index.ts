export type UserRole = 'customer' | 'companion' | 'admin';

export type BookingStatus = 
  | 'pending'      // รอ Companion ตอบรับ
  | 'accepted'     // Companion ตอบรับแล้ว รอนัดหมาย
  | 'on_the_way'   // Companion กำลังเดินทางไปรับ
  | 'in_progress'  // อยู่ระหว่างเดินทาง/ทำธุระร่วมกัน
  | 'completed'    // สิ้นสุดบริการเรียบร้อย
  | 'cancelled';   // ยกเลิก

export type ErrandCategory = 
  | 'hospital'     // พบแพทย์ตามนัด / ไปโรงพยาบาล
  | 'bank'         // ไปธนาคาร / การเงิน
  | 'government'   // ติดต่อหน่วยงานราชการ
  | 'shopping'     // ซื้อของ / ห้างสรรพสินค้า / จ่ายตลาด
  | 'general';     // ธุระอื่นๆ ทั่วไป

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  health_notes?: string; // ข้อควรระวังทั่วไป เช่น เดินช้า, ใช้วีลแชร์ (ไม่ใช่ข้อมูลเวชระเบียน)
  created_at: string;
}

export interface CompanionProfile {
  user_id: string;
  profile: UserProfile;
  bio: string;
  hourly_rate: number;
  service_areas: string[]; // เช่น 'เขตบางรัก', 'เขตจตุจักร', 'นนทบุรี'
  skills: string[]; // เช่น 'การใช้วีลแชร์', 'ปฐมพยาบาลเบื้องต้น', 'ภาษาอังกฤษ', 'ใจเย็น/สื่อสารดี'
  vehicle_type?: 'walk_public' | 'car' | 'motorcycle';
  id_card_verified: boolean;
  is_available: boolean;
  rating_avg: number;
  review_count: number;
  completed_trips: number;
  available_days?: string[]; // เช่น ['จันทร์', 'พุธ', 'ศุกร์']
}

export interface BookingTimelineEvent {
  status: BookingStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer: UserProfile;
  companion_id?: string | null;
  companion?: CompanionProfile | null;
  category: ErrandCategory;
  title: string;
  description: string;
  pickup_address: string;
  destination_address: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  duration_hours: number;
  special_needs?: string; // เช่น ใช้วีลแชร์, ต้องการคนช่วยพยุง, หูตึงเล็กน้อย
  notes?: string;
  status: BookingStatus;
  estimated_price: number;
  timeline: BookingTimelineEvent[];
  created_at: string;
  review?: Review;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  companion_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

export interface CategoryInfo {
  id: ErrandCategory;
  name_th: string;
  name_en: string;
  description: string;
  icon_name: string;
  color: string;
}
