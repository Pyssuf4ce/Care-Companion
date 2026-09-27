'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/data/mock-data';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CompanionJobsPage() {
  const { currentUser, companions, bookings, acceptBooking } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDuration, setFilterDuration] = useState<string>('all');

  // Active companion profile
  const companionProfile = companions.find(c => c.user_id === currentUser.id) || companions[0];

  // Filter bookings that are either pending or open
  const openJobs = useMemo(() => {
    return bookings.filter(b => {
      const isPending = b.status === 'pending';
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const matchesSearch = 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.destination_address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDuration = filterDuration === 'all' || b.duration_hours === Number(filterDuration);

      return isPending && matchesCategory && matchesSearch && matchesDuration;
    });
  }, [bookings, selectedCategory, searchTerm, filterDuration]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">กระดานค้นหางาน</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          คำขอร่วมเดินทางที่เปิดรับ Companion
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          เลือกรับงานที่ตรงกับวันเวลาและพื้นที่ที่คุณสะดวก ให้บริการด้วยความอบอุ่นและปลอดภัย
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อธุระ หรือสถานที่รับ-ส่ง..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">📂 ทุกประเภทธุระ</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name_th}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">⏱️ ทุกระยะเวลา</option>
              <option value="2">2 ชั่วโมง</option>
              <option value="3">3 ชั่วโมง</option>
              <option value="4">4 ชั่วโมง</option>
              <option value="5">5 ชั่วโมงขึ้นไป</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>พบคำขอที่ตรงเงื่อนไข <strong>{openJobs.length}</strong> รายการ</span>
          <span>อัตราค่าบริการของคุณ: ฿{companionProfile.hourly_rate} / ชม.</span>
        </div>
      </div>

      {/* Jobs Grid */}
      {openJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">ไม่มีคำขอค้างรับในขณะนี้</h3>
          <p className="text-xs text-slate-500">
            คำขอที่เปิดรับทั้งหมดได้รับการตอบรับเรียบร้อยแล้ว หรือลองปรับเงื่อนไขตัวกรองใหม่
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wide block">
                      #{job.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {job.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    รอคนรับ
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {job.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>วันที่ <strong>{job.appointment_date}</strong> เวลา <strong>{job.start_time} น.</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>ระยะเวลา: <strong>{job.duration_hours} ชั่วโมง</strong></span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="truncate">จุดรับ: {job.pickup_address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="truncate">ปลายทาง: {job.destination_address}</span>
                  </div>
                </div>

                {job.special_needs && (
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200/70 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{job.special_needs}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <img
                    src={job.customer.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                    alt={job.customer.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>ผู้รับบริการ: {job.customer.full_name}</span>
                </div>

              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">ค่าตอบแทน</span>
                  <p className="text-base font-bold text-teal-700">฿{job.estimated_price}</p>
                </div>

                <button
                  onClick={() => {
                    acceptBooking(job.id, companionProfile);
                    confetti({
                      particleCount: 80,
                      spread: 70,
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
  );
}
