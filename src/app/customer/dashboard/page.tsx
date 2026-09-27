'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, 
  MapPin, 
  PlusCircle, 
  User, 
  AlertCircle, 
  ArrowRight,
  Star,
  Phone,
  Search
} from 'lucide-react';
import { BookingStatus } from '@/types';

const STATUS_BADGES: Record<BookingStatus, { label: string; class: string }> = {
  pending: { label: 'รอ Companion ตอบรับ', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted: { label: 'Companion ตอบรับแล้ว', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  on_the_way: { label: 'กำลังเดินทางมารับ', class: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' },
  in_progress: { label: 'กำลังร่วมเดินทาง/ทำธุระ', class: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse' },
  completed: { label: 'สิ้นสุดบริการเรียบร้อย', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelled: { label: 'ยกเลิก', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function CustomerDashboard() {
  const { currentUser, bookings } = useApp();

  // Filter bookings for this customer
  const customerBookings = bookings.filter(b => b.customer_id === currentUser.id);
  const activeBookings = customerBookings.filter(b => ['pending', 'accepted', 'on_the_way', 'in_progress'].includes(b.status));
  const pastBookings = customerBookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.full_name.charAt(0)}
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-xs font-medium mb-1">
              <span>ผู้รับบริการ (Customer Portal)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              สวัสดีครับ, {currentUser.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              พร้อมดูแลคุณในทุกการเดินทางและการทำธุระอย่างปลอดภัย
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/customer/bookings/new"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-teal-800 font-bold text-sm shadow hover:bg-teal-50 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>สร้างคำขอใหม่</span>
          </Link>
          <Link
            href="/customer/companions"
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-teal-800/60 hover:bg-teal-800 text-white font-semibold text-sm border border-white/20 transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">ค้นหา</span> Companion
          </Link>
        </div>
      </div>

      {/* Emergency Contact & Health Notice Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            ข้อมูลผู้รับบริการ & ข้อควรระวังในการร่วมเดินทาง
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">ที่อยู่นัดรับเริ่มต้น</span>
              <p className="font-medium text-slate-800">{currentUser.address || 'ยังไม่ได้ระบุที่อยู่'}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">ข้อควรระวัง/ความช่วยเหลือที่ต้องการ</span>
              <p className="font-medium text-slate-800">{currentUser.health_notes || 'ไม่มีข้อควรระวังพิเศษ'}</p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/70 rounded-2xl p-6 border border-rose-200/80 shadow-sm space-y-2.5">
          <span className="text-[11px] font-bold text-rose-700 tracking-wider uppercase flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-rose-600" /> ข้อมูลติดต่อกรณีฉุกเฉิน
          </span>
          <p className="text-sm font-bold text-slate-900">
            {currentUser.emergency_contact?.name || 'คุณชัยพร (บุตรชาย)'}
          </p>
          <p className="text-xs text-slate-600">
            ความสัมพันธ์: {currentUser.emergency_contact?.relation || 'บุตร'}
          </p>
          <div className="pt-2">
            <a
              href={`tel:${currentUser.emergency_contact?.phone || '0898765432'}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>โทร: {currentUser.emergency_contact?.phone || '089-876-5432'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Active Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>การเดินทางที่กำลังดำเนินการ / นัดหมายที่จะถึง</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {activeBookings.length}
            </span>
          </h2>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">ไม่มีนัดหมายที่กำลังดำเนินการ</p>
            <p className="text-xs text-slate-500">
              คุณสามารถกดปุ่ม "สร้างคำขอใหม่" ด้านบนเพื่อค้นหาเพื่อนร่วมเดินทางได้ทันที
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((booking) => {
              const statusBadge = STATUS_BADGES[booking.status];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wide">
                          รหัสจอง: #{booking.id}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug">
                          {booking.title}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>วันที่: <strong>{booking.appointment_date}</strong> เวลา <strong>{booking.start_time} น.</strong> ({booking.duration_hours} ชม.)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="truncate">จุดรับ: {booking.pickup_address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="truncate">ปลายทาง: {booking.destination_address}</span>
                      </div>
                    </div>

                    {/* Companion Info if assigned */}
                    {booking.companion ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.companion.profile.avatar_url}
                            alt={booking.companion.profile.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
                          />
                          <div>
                            <span className="text-[10px] text-teal-600 font-semibold block">ผู้ร่วมเดินทางของคุณ</span>
                            <p className="text-xs font-bold text-slate-800">{booking.companion.profile.full_name}</p>
                            <p className="text-[10px] text-slate-500">โทร: {booking.companion.profile.phone}</p>
                          </div>
                        </div>
                        <a
                          href={`tel:${booking.companion.profile.phone}`}
                          className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
                          title="โทรหา Companion"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>กำลังเปิดรับคำขอ Companion ในพื้นที่กำลังตรวจสอบ...</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">ประมาณการค่าบริการ</span>
                      <span className="text-base font-bold text-teal-700">฿{booking.estimated_price}</span>
                    </div>

                    <Link
                      href={`/customer/bookings/${booking.id}`}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <span>ติดตามไทม์ไลน์สถานะ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trip History Section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900">
          ประวัติการใช้บริการที่ผ่านมา ({pastBookings.length})
        </h2>

        {pastBookings.length === 0 ? (
          <p className="text-xs text-slate-500">ยังไม่มีประวัติการใช้บริการก่อนหน้า</p>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {pastBookings.map((b) => (
              <div key={b.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{b.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      สำเร็จเรียบร้อย
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    เมื่อวันที่ {b.appointment_date} • Companion: {b.companion?.profile.full_name || 'น้องเมย์ กานต์พิชชา'}
                  </p>
                  {b.review && (
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold pt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{b.review.rating} ดาว: "{b.review.comment}"</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-bold text-slate-700">฿{b.estimated_price}</span>
                  <Link
                    href={`/customer/bookings/${b.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
