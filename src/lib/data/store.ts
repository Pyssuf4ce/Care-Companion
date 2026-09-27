'use client';

import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CompanionProfile, 
  Booking, 
  BookingStatus, 
  UserRole,
  Review 
} from '@/types';
import { 
  MOCK_CUSTOMERS, 
  MOCK_COMPANIONS, 
  MOCK_ADMIN, 
  MOCK_BOOKINGS 
} from './mock-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'care_companion_current_user',
  BOOKINGS: 'care_companion_bookings',
  COMPANIONS: 'care_companion_companions',
  CUSTOMERS: 'care_companion_customers',
};

// Initial state helpers
function getInitialUser(): UserProfile {
  if (typeof window === 'undefined') return MOCK_CUSTOMERS[0];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading current user from localStorage', e);
  }
  return MOCK_CUSTOMERS[0]; // Default to customer
}

function getInitialBookings(): Booking[] {
  if (typeof window === 'undefined') return MOCK_BOOKINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading bookings from localStorage', e);
  }
  return MOCK_BOOKINGS;
}

function getInitialCompanions(): CompanionProfile[] {
  if (typeof window === 'undefined') return MOCK_COMPANIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIONS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading companions from localStorage', e);
  }
  return MOCK_COMPANIONS;
}

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getInitialUser);
  const [bookings, setBookings] = useState<Booking[]>(getInitialBookings);
  const [companions, setCompanions] = useState<CompanionProfile[]>(getInitialCompanions);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync to localStorage on change
  useEffect(() => {
    setIsLoaded(true);
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedCompanions = localStorage.getItem(STORAGE_KEYS.COMPANIONS);
      if (savedCompanions) setCompanions(JSON.parse(savedCompanions));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  };

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(newBookings));
    }
  };

  const saveCompanions = (newCompanions: CompanionProfile[]) => {
    setCompanions(newCompanions);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.COMPANIONS, JSON.stringify(newCompanions));
    }
  };

  // Switch role or quick demo login
  const switchRole = (role: UserRole, targetId?: string) => {
    let targetUser: UserProfile;
    if (role === 'admin') {
      targetUser = MOCK_ADMIN;
    } else if (role === 'companion') {
      const comp = companions.find(c => targetId ? c.user_id === targetId : true) || companions[0];
      targetUser = comp.profile;
    } else {
      const cust = MOCK_CUSTOMERS.find(c => targetId ? c.id === targetId : true) || MOCK_CUSTOMERS[0];
      targetUser = cust;
    }
    saveUser(targetUser);
  };

  // Create a new booking request
  const createBooking = (bookingData: Omit<Booking, 'id' | 'created_at' | 'timeline' | 'customer'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      created_at: new Date().toISOString(),
      customer: currentUser,
      customer_id: currentUser.id,
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          title: 'สร้างคำขอสำเร็จ',
          description: 'ระบบกำลังส่งคำขอไปยัง Companion ที่พร้อมให้บริการ',
        },
      ],
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    return newBooking;
  };

  // Companion accepts booking
  const acceptBooking = (bookingId: string, companionProfile: CompanionProfile) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          companion_id: companionProfile.user_id,
          companion: companionProfile,
          status: 'accepted' as BookingStatus,
          timeline: [
            ...b.timeline,
            {
              status: 'accepted' as BookingStatus,
              timestamp: new Date().toISOString(),
              title: `${companionProfile.profile.full_name} ตอบรับคำขอแล้ว`,
              description: `Companion ยืนยันเวลานัดหมาย ${b.start_time} น. วันที่ ${b.appointment_date}`,
            },
          ],
        };
      }
      return b;
    });
    saveBookings(updated);
  };

  // Update booking status
  const updateBookingStatus = (bookingId: string, nextStatus: BookingStatus, customNote?: string) => {
    const statusTitles: Record<BookingStatus, string> = {
      pending: 'รอการตอบรับ',
      accepted: 'Companion ตอบรับงานแล้ว',
      on_the_way: 'Companion กำลังออกเดินทางไปยังจุดนัดรับ',
      in_progress: 'รับผู้รับบริการแล้ว และอยู่ระหว่างทำธุระร่วมกัน',
      completed: 'สิ้นสุดบริการเรียบร้อย',
      cancelled: 'ยกเลิกบริการ',
    };

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: nextStatus,
          timeline: [
            ...b.timeline,
            {
              status: nextStatus,
              timestamp: new Date().toISOString(),
              title: statusTitles[nextStatus],
              description: customNote || `อัปเดตสถานะเป็น ${statusTitles[nextStatus]}`,
            },
          ],
        };
      }
      return b;
    });
    saveBookings(updated);
  };

  // Add review
  const addReview = (bookingId: string, rating: number, comment: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const newReview: Review = {
          id: `rev-${Date.now()}`,
          booking_id: bookingId,
          customer_id: currentUser.id,
          customer_name: currentUser.full_name,
          companion_id: b.companion_id || '',
          rating,
          comment,
          created_at: new Date().toISOString(),
        };

        // Also update companion rating avg
        if (b.companion_id) {
          const compUpdated = companions.map(c => {
            if (c.user_id === b.companion_id) {
              const newCount = c.review_count + 1;
              const newAvg = Number(((c.rating_avg * c.review_count + rating) / newCount).toFixed(2));
              return {
                ...c,
                rating_avg: newAvg,
                review_count: newCount,
                completed_trips: c.completed_trips + 1,
              };
            }
            return c;
          });
          saveCompanions(compUpdated);
        }

        return {
          ...b,
          review: newReview,
        };
      }
      return b;
    });
    saveBookings(updated);
  };

  // Toggle companion availability
  const toggleCompanionAvailability = (userId: string) => {
    const updated = companions.map(c => {
      if (c.user_id === userId) {
        return { ...c, is_available: !c.is_available };
      }
      return c;
    });
    saveCompanions(updated);
  };

  // Admin verifies companion
  const setCompanionVerification = (userId: string, verified: boolean) => {
    const updated = companions.map(c => {
      if (c.user_id === userId) {
        return { ...c, id_card_verified: verified };
      }
      return c;
    });
    saveCompanions(updated);
  };

  // Reset to initial mock data
  const resetToDefault = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.COMPANIONS);
    }
    setCurrentUser(MOCK_CUSTOMERS[0]);
    setBookings(MOCK_BOOKINGS);
    setCompanions(MOCK_COMPANIONS);
  };

  return {
    currentUser,
    bookings,
    companions,
    isLoaded,
    saveUser,
    switchRole,
    createBooking,
    acceptBooking,
    updateBookingStatus,
    addReview,
    toggleCompanionAvailability,
    setCompanionVerification,
    resetToDefault,
  };
}
