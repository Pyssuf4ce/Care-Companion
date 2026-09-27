'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BookingStatus } from '@/types';
import { 
  Calendar,
  Clock, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STATUS_STEPS: { status: BookingStatus; label: string; desc: string }[] = [
  { status: 'pending', label: 'สร้างคำขอ', desc: 'ส่งคำขอร่วมเดินทางเข้าสู่ระบบ' },
  { status: 'accepted', label: 'ตอบรับแล้ว', desc: 'Companion ยืนยันเวลานัดหมาย' },
  { status: 'on_the_way', label: 'กำลังเดินทางมารับ', desc: 'Companion กำลังเดินทางไปยังจุดนัดพบ' },
  { status: 'in_progress', label: 'กำลังร่วมเดินทาง/ทำธุระ', desc: 'รับผู้รับบริการแล้ว และอยู่ระหว่างอำนวยความสะดวก' },
  { status: 'completed', label: 'สิ้นสุดบริการ', desc: 'ส่งกลับถึงที่หมายปลอดภัยและเสร็จสิ้น' },
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { bookings, updateBookingStatus, addReview } = useApp();

  const booking = bookings.find(b => b.id === bookingId);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">ไม่พบข้อมูลการจองนี้</h2>
        <p className="text-sm text-slate-500">รหัสการจอง #{bookingId} อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
        <Link href="/customer/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs">
          กลับสู่แดชบอร์ด
        </Link>
      </div>
    );
  }

  // Get current step index
  const currentStepIdx = STATUS_STEPS.findIndex(s => s.status === booking.status);

  // Quick Demo status advance
  const handleAdvanceStatus = (nextStatus: BookingStatus) => {
    updateBookingStatus(bookingId, nextStatus);
    if (nextStatus === 'completed') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(bookingId, rating, comment);
    setReviewSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                รหัสคำขอ #{booking.id}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">สร้างเมื่อ {new Date(booking.created_at).toLocaleDateString('th-TH')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {booking.title}
            </h1>
          </div>

          {/* IT309 Demo Status Simulation Bar */}
          <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 px-1">จำลองสถานะ:</span>
            {booking.status === 'pending' && (
              <button
                onClick={() => handleAdvanceStatus('accepted')}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-sm transition"
              >
                1. ตอบรับงาน
              </button>
            )}
            {booking.status === 'accepted' && (
              <button
                onClick={() => handleAdvanceStatus('on_the_way')}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-sm transition"
              >
                2. ออกเดินทางไปรับ
              </button>
            )}
            {booking.status === 'on_the_way' && (
              <button
                onClick={() => handleAdvanceStatus('in_progress')}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-sm transition"
              >
                3. ถึงจุดรับ/เริ่มทำธุระ
              </button>
            )}
            {booking.status === 'in_progress' && (
              <button
                onClick={() => handleAdvanceStatus('completed')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition"
              >
                4. สิ้นสุดบริการ
              </button>
            )}
            {booking.status === 'completed' && (
              <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-md">
                ✓ บริการเสร็จสมบูรณ์
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Status Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <span>สถานะการให้บริการแบบเรียลไทม์ (Live Status Tracking)</span>
        </h2>

        {/* Progress Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;
            return (
              <div
                key={step.status}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/30'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 opacity-60 text-slate-400'
                }`}
              >
                <div>
                  <div className="mx-auto mb-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-xs">{step.label}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Event Timeline Log */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            บันทึกความเคลื่อนไหว (Activity Log)
          </h3>
          <div className="space-y-3">
            {booking.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{event.title}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details & Companion Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Errand & Route Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            รายละเอียดการนัดหมายและการเดินทาง
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> วันที่นัดหมาย
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.appointment_date}</p>
              <p className="text-slate-500">เวลาเริ่ม: {booking.start_time} น. ({booking.duration_hours} ชั่วโมง)</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ประมาณการค่าบริการ
              </span>
              <p className="font-bold text-teal-600 text-base">฿{booking.estimated_price}</p>
              <p className="text-slate-500">คิดตามชั่วโมงบริการจริง</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> จุดรับต้นทาง:
              </span>
              <p className="text-xs font-medium text-slate-800">{booking.pickup_address}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> จุดหมายปลายทาง:
              </span>
              <p className="text-xs font-medium text-slate-800">{booking.destination_address}</p>
            </div>
          </div>

          {booking.special_needs && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> ความต้องการพิเศษ/ข้อควรระวัง:
              </span>
              <p>{booking.special_needs}</p>
            </div>
          )}
        </div>

        {/* Right: Companion Card & Emergency Hotlines */}
        <div className="space-y-6">
          
          {/* Companion Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              ผู้ช่วยร่วมเดินทาง (Companion)
            </span>

            {booking.companion ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.companion.profile.avatar_url}
                    alt={booking.companion.profile.full_name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {booking.companion.profile.full_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{booking.companion.rating_avg} ({booking.companion.review_count} รีวิว)</span>
                    </div>
                    {booking.companion.id_card_verified && (
                      <span className="inline-flex items-center text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                        <ShieldCheck className="w-3 h-3 mr-0.5" /> ยืนยันตัวตนแล้ว
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">"{booking.companion.bio}"</p>

                <div className="pt-2">
                  <a
                    href={`tel:${booking.companion.profile.phone}`}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>โทรติดต่อ Companion ({booking.companion.profile.phone})</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">กำลังรอ Companion ตอบรับ</p>
                <p className="text-[11px] text-slate-400">
                  ระบบได้แจ้งเตือน Companion ในพื้นที่เรียบร้อยแล้ว
                </p>
              </div>
            )}
          </div>

          {/* Emergency Hotlines */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              เบอร์ติดต่อฉุกเฉิน (Emergency)
            </span>
            <div className="space-y-2 text-xs">
              <a
                href="tel:1669"
                className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-rose-600 transition text-white"
              >
                <span>🚑 การแพทย์ฉุกเฉิน</span>
                <span className="font-bold">1669</span>
              </a>
              <a
                href="tel:191"
                className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <span>👮 ตำรวจ / เหตุด่วน</span>
                <span className="font-bold">191</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Review & Rating Form (Visible when trip is completed) */}
      {booking.status === 'completed' && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h3 className="text-lg font-bold text-slate-900">
              ให้คะแนนและรีวิวบริการ (Rating & Review)
            </h3>
          </div>

          {booking.review || reviewSubmitted ? (
            <div className="bg-white p-5 rounded-2xl border border-teal-100 space-y-2">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                {[...Array(booking.review?.rating || rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-slate-800">
                  ({booking.review?.rating || rating} / 5 ดาว)
                </span>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{booking.review?.comment || comment}"
              </p>
              <span className="text-[11px] text-teal-600 font-semibold block pt-1">
                ✓ บันทึกรีวิวเรียบร้อยแล้ว ขอบคุณสำหรับการร่วมเดินทางครับ
              </span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                ความคิดเห็นของคุณมีความหมายอย่างยิ่งในการพัฒนาคุณภาพของ Companion และสร้างความมั่นใจแก่ผู้ร่วมเดินทางท่านอื่น
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ระดับความพึงพอใจ:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-2">
                    {rating} เต็ม 5 ดาว
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ความคิดเห็นและคำชมเชย:
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="เช่น น้องสุภาพมาก คอยประคองและช่วยถือของตลอดการเดินทาง อุ่นใจมากค่ะ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งรีวิวและให้คะแนน</span>
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
