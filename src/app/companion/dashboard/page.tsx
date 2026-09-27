'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Power, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Phone,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingStatus } from '@/types';

export default function CompanionDashboard() {
  const { 
    currentUser, 
    companions, 
    bookings, 
    toggleCompanionAvailability, 
    acceptBooking, 
    updateBookingStatus 
  } = useApp();

  // Find the active companion profile
  const companionProfile = companions.find(c => c.user_id === currentUser.id) || companions[0];

  // Bookings assigned to this companion
  const myAssignedBookings = bookings.filter(b => b.companion_id === companionProfile.user_id);
  const activeJob = myAssignedBookings.find(b => ['accepted', 'on_the_way', 'in_progress'].includes(b.status));
  const completedJobs = myAssignedBookings.filter(b => b.status === 'completed');

  // Open pending requests waiting for a companion
  const openPendingRequests = bookings.filter(b => b.status === 'pending');

  // Total earnings estimate
  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.estimated_price, 0);

  const handleStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    updateBookingStatus(bookingId, nextStatus);
    if (nextStatus === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Companion Welcome & Availability Header */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={companionProfile.profile.avatar_url}
            alt={companionProfile.profile.full_name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-300 text-xs font-semibold border border-teal-500/40">
                เพื่อนร่วมทาง (Companion Portal)
              </span>
              {companionProfile.id_card_verified && (
                <span className="flex items-center text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> ยืนยันตัวตนแล้ว
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {companionProfile.profile.full_name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>พื้นที่บริการ: {companionProfile.service_areas.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle Button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
          <button
            onClick={() => toggleCompanionAvailability(companionProfile.user_id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
              companionProfile.is_available
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>สถานะ: {companionProfile.is_available ? '● พร้อมรับงาน (Online)' : '○ ไม่รับงาน (Offline)'}</span>
          </button>

          <Link
            href="/companion/profile"
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
          >
            แก้ไขโปรไฟล์
          </Link>
        </div>
      </div>

      {/* Companion Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">งานที่สำเร็จแล้ว</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{companionProfile.completed_trips}</p>
          <p className="text-[11px] text-teal-600 font-medium">เที่ยวเดินทาง</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">คะแนนความพึงพอใจ</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{companionProfile.rating_avg}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-[11px] text-slate-500">จากทั้งหมด {companionProfile.review_count} รีวิว</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">อัตราค่าบริการของคุณ</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">฿{companionProfile.hourly_rate}</p>
          <p className="text-[11px] text-slate-500">บาท / ชั่วโมง</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">รายได้สะสมโดยประมาณ</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">฿{totalEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">จากการให้บริการจริง</p>
        </div>
      </div>

      {/* Active Trip Controller (if any) */}
      {activeJob && (
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500/50 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white animate-pulse">
                ● งานที่กำลังดำเนินการอยู่ (Active Job)
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                {activeJob.title}
              </h2>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-100/70 px-3 py-1.5 rounded-xl">
              ค่าบริการ: ฿{activeJob.estimated_price} ({activeJob.duration_hours} ชม.)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> จุดรับผู้รับบริการ:
              </span>
              <p className="font-medium text-slate-800">{activeJob.pickup_address}</p>
              <p className="text-slate-500">นัดพบเวลา: {activeJob.start_time} น. วันที่ {activeJob.appointment_date}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> จุดหมายปลายทาง:
              </span>
              <p className="font-medium text-slate-800">{activeJob.destination_address}</p>
              {activeJob.special_needs && (
                <p className="text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  ⚠️ ข้อควรระวัง: {activeJob.special_needs}
                </p>
              )}
            </div>
          </div>

          {/* Customer Contact Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={activeJob.customer.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={activeJob.customer.full_name}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-slate-400">ผู้รับบริการ</p>
                <p className="text-sm font-bold text-slate-900">{activeJob.customer.full_name}</p>
                <p className="text-xs text-slate-600">เบอร์โทร: {activeJob.customer.phone}</p>
              </div>
            </div>

            <a
              href={`tel:${activeJob.customer.phone}`}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>โทรหาผู้รับบริการ</span>
            </a>
          </div>

          {/* Status Progression Controls */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              ขั้นตอนการปฏิบัติงาน (กดเพื่ออัปเดตสถานะให้ Customer ทราบ):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {activeJob.status === 'accepted' && (
                <button
                  onClick={() => handleStatusChange(activeJob.id, 'on_the_way')}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <span>1. ออกเดินทางไปยังจุดรับ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {activeJob.status === 'on_the_way' && (
                <button
                  onClick={() => handleStatusChange(activeJob.id, 'in_progress')}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <span>2. พบผู้รับบริการแล้ว / เริ่มทำธุระร่วมกัน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {activeJob.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange(activeJob.id, 'completed')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3. ส่งกลับถึงที่หมายปลอดภัย / สิ้นสุดบริการ</span>
                </button>
              )}

              <Link
                href={`/customer/bookings/${activeJob.id}`}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
              >
                ดูหน้าไทม์ไลน์เต็ม
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Open Booking Requests (Waiting for Companion) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>คำขอที่เปิดรับ Companion ในขณะนี้</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {openPendingRequests.length} รายการ
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              คุณสามารถกด "ตอบรับคำขอ" เพื่อเป็นผู้ช่วยร่วมเดินทางในรายการที่สะดวกได้ทันที
            </p>
          </div>

          <Link
            href="/companion/jobs"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>ดูทั้งหมดในกระดานงาน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {openPendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-700">ไม่มีคำขอค้างในขณะนี้</p>
            <p className="text-xs text-slate-400">คำขอทั้งหมดได้รับการตอบรับเรียบร้อยแล้ว</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openPendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {req.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                      รอคนรับ
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>วันที่ {req.appointment_date} เวลา {req.start_time} น. ({req.duration_hours} ชม.)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="truncate">จุดรับ: {req.pickup_address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="truncate">ปลายทาง: {req.destination_address}</span>
                    </div>
                  </div>

                  {req.special_needs && (
                    <p className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                      ⚠️ {req.special_needs}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ค่าตอบแทน</span>
                    <p className="text-base font-bold text-teal-700">฿{req.estimated_price}</p>
                  </div>

                  <button
                    onClick={() => {
                      acceptBooking(req.id, companionProfile);
                      confetti({
                        particleCount: 60,
                        spread: 60,
                        origin: { y: 0.6 },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>ตอบรับงานนี้</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
