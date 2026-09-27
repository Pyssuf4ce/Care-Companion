'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/data/mock-data';
import { ErrandCategory } from '@/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ErrandCategory) || 'hospital';
  const preselectedCompanionId = searchParams.get('companionId');

  const { currentUser, companions, createBooking } = useApp();

  const [category, setCategory] = useState<ErrandCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState(currentUser.address || '128/4 ซอยอารีย์สัมพันธ์ แขวงพญาไท เขตพญาไท กทม.');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-09-28');
  const [startTime, setStartTime] = useState('09:30');
  const [durationHours, setDurationHours] = useState(3);
  const [specialNeeds, setSpecialNeeds] = useState(currentUser.health_notes || '');
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(preselectedCompanionId || 'open');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated price based on companion hourly rate or default average (250 THB/hr)
  const chosenCompanion = companions.find(c => c.user_id === selectedCompanionId);
  const hourlyRate = chosenCompanion ? chosenCompanion.hourly_rate : 250;
  const estimatedPrice = hourlyRate * durationHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingTitle = title.trim() || `ขอเพื่อนร่วมเดินทาง: ${CATEGORIES.find(c => c.id === category)?.name_th}`;

    const newBooking = createBooking({
      customer_id: currentUser.id,
      companion_id: chosenCompanion ? chosenCompanion.user_id : null,
      companion: chosenCompanion || null,
      category,
      title: bookingTitle,
      description,
      pickup_address: pickupAddress,
      destination_address: destinationAddress,
      appointment_date: appointmentDate,
      start_time: startTime,
      duration_hours: durationHours,
      special_needs: specialNeeds,
      status: chosenCompanion ? 'accepted' : 'pending',
      estimated_price: estimatedPrice,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/customer/bookings/${newBooking.id}`);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button & Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          สร้างคำขอผู้ช่วยร่วมเดินทาง (Care Request)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          ระบุรายละเอียดของธุระ สถานที่ และความต้องการ เพื่อให้ Companion ร่วมเดินทางดูแลอย่างเหมาะสม
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Category Selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            1. เลือกประเภทของธุระ (Errand Category) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  category === cat.id
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{cat.name_th}</span>
                  {category === cat.id && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Destination & Pickup Addresses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            2. ข้อมูลสถานที่ต้นทางและปลายทาง <span className="text-rose-500">*</span>
          </label>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หัวข้อคำขอ (เช่น ไปพบแพทย์ตรวจเลือด รพ.รามาธิบดี)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ระบุชื่อธุระสั้นๆ ที่เข้าใจง่าย"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  สถานที่ต้นทาง / จุดนัดรับ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="บ้านเลขที่, ชื่ออาคาร, ซอย, ถนน หรือจุดสังเกต"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  สถานที่ปลายทาง / จุดหมายทำธุระ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={2}
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="เช่น โรงพยาบาลศิริราช อาคารนวมินทรบพิตร 84 พรรษา หรือธนาคารกรุงเทพ สาขา..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รายละเอียดของธุระเพิ่มเติม
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุสิ่งที่ต้องการให้ช่วยเหลือ เช่น ช่วยกดบัตรคิว, ช่วยรอรับยา, ช่วยพาไปเข้าห้องน้ำ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Date, Time & Duration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            3. วัน เวลา และระยะเวลาที่ต้องการใช้บริการ <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                วันที่นัดหมาย
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                เวลานัดพบ (เริ่มงาน)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ระยะเวลาที่ต้องการ (ชั่วโมง)
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
              >
                <option value={1}>1 ชั่วโมง (ธุระด่วน)</option>
                <option value={2}>2 ชั่วโมง (ธนาคาร/ซื้อของ)</option>
                <option value={3}>3 ชั่วโมง (ติดต่อราชการ/พบแพทย์ปกติ)</option>
                <option value={4}>4 ชั่วโมง (ตรวจเฉพาะทาง/รอผลแล็บ)</option>
                <option value={5}>5 ชั่วโมง (ทั้งครึ่งวัน)</option>
                <option value={6}>6 ชั่วโมง (ทั้งวัน)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Special Needs & Health Safety */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 block">
              4. ความต้องการพิเศษและข้อควรระวัง
            </label>
            <span className="text-[11px] text-teal-600 font-semibold">
              ช่วยให้ Companion เตรียมพร้อมได้อย่างเหมาะสม
            </span>
          </div>

          <div className="space-y-3">
            <textarea
              rows={2}
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="เช่น มีวีลแชร์ส่วนตัว, เดินช้าต้องการคนช่วยพยุง, หูตึงเล็กน้อยให้พูดชัดๆ, ต้องการให้ช่วยถือสัมภาระ"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                ข้อมูลเหล่านี้จะถูกส่งให้ Companion เพื่อการอำนวยความสะดวกในการเดินทางเท่านั้น (ไม่ใช่ข้อมูลทางการแพทย์)
              </span>
            </div>
          </div>
        </div>

        {/* 5. Companion Selection Option */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            5. เลือกเพื่อนร่วมทาง (Companion)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedCompanionId('open')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedCompanionId === 'open'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-800">🌐 ประกาศเปิดรับทั่วไป (Broadcast)</span>
                {selectedCompanionId === 'open' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </div>
              <p className="text-xs text-slate-500">
                ให้ Companion ในพื้นที่ที่สะดวกและตรงเงื่อนไขเข้ามากดตอบรับคำขอ
              </p>
            </button>

            {companions.slice(0, 3).map((comp) => (
              <button
                type="button"
                key={comp.user_id}
                onClick={() => setSelectedCompanionId(comp.user_id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedCompanionId === comp.user_id
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={comp.profile.avatar_url}
                    alt={comp.profile.full_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-800">{comp.profile.full_name}</p>
                    <p className="text-xs text-teal-600 font-semibold">฿{comp.hourly_rate}/ชม. • ดาว {comp.rating_avg}</p>
                  </div>
                </div>
                {selectedCompanionId === comp.user_id && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Summary & Price Calculation */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider block">
                สรุปค่าบริการโดยประมาณ
              </span>
              <p className="text-3xl font-extrabold text-white mt-1">
                ฿{estimatedPrice}{' '}
                <span className="text-xs font-normal text-slate-300">
                  (คำนวณจาก {durationHours} ชม. × ฿{hourlyRate}/ชม.)
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                * ค่าพาหนะเดินทาง (เช่น ค่ารถไฟฟ้า/แท็กซี่) ชำระตามจริงระหว่างการเดินทาง
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base shadow-lg shadow-teal-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันสร้างคำขอร่วมเดินทาง'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    }>
      <NewBookingContent />
    </Suspense>
  );
}
