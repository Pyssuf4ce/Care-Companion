'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/data/mock-data';
import { 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Stethoscope, 
  Landmark, 
  Building2, 
  ShoppingBag, 
  Sparkles,
  Compass,
  AlertCircle,
  Heart
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Stethoscope,
  Landmark,
  Building2,
  ShoppingBag,
  Sparkles,
};

export default function HomePage() {
  const { companions } = useApp();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/80 via-white to-slate-50 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-teal-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs sm:text-sm font-medium shadow-sm">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>แพลตฟอร์มเพื่อนร่วมเดินทางสำหรับทุกคนในครอบครัว</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                เพื่อนร่วมทางที่อุ่นใจ <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  ไปไหนก็ไม่ต้องกังวล
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                หมดกังวลเมื่อคนในครอบครัวติดธุระ ไม่สามารถเดินทางไปด้วยได้ Care Companion เชื่อมโยงคุณกับเพื่อนร่วมเดินทางที่ผ่านการตรวจสอบประวัติ พร้อมดูแลเคียงข้างตั้งแต่รับจากบ้านจนส่งกลับอย่างปลอดภัย
              </p>

              {/* Crucial Assignment Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 max-w-xl mx-auto lg:mx-0">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>โปรดทราบ:</strong> Companion มีหน้าที่ช่วยเหลือและอำนวยความสะดวกในการเดินทางและการทำธุระเท่านั้น <u>ไม่ใช่ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย</u>
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/customer/bookings/new"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-center shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 transition flex items-center justify-center gap-2 group"
                >
                  <span>สร้างคำขอร่วมเดินทาง</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/customer/companions"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-center border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>ค้นหา Companion รอบตัว</span>
                </Link>

                <Link
                  href="/companion/jobs"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-center text-sm transition"
                >
                  สมัครเป็น Companion
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-center sm:text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">ยืนยันตัวตนบัตร ปชช.</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-600">4.9 / 5.0</p>
                  <p className="text-xs text-slate-500">คะแนนความพึงพอใจ</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1,500+</p>
                  <p className="text-xs text-slate-500">เที่ยวเดินทางสำเร็จ</p>
                </div>
              </div>
            </div>

            {/* Right Hero Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 block">งานที่กำลังเกิดขึ้นจริง</span>
                      <p className="text-sm font-bold text-slate-800">ไปพบแพทย์ตามนัด รพ.ศิริราช</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    กำลังให้บริการ
                  </span>
                </div>

                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-600" /> จุดรับ: ซอยอารีย์สัมพันธ์</span>
                    <span className="font-semibold text-slate-800">09:00 น.</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> ปลายทาง: อาคารผู้ป่วยนอก ศิริราช</span>
                    <span className="font-semibold text-slate-800">4 ชั่วโมง</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={companions[0]?.profile.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                      alt="Companion"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <div>
                      <p className="text-xs text-slate-500">เพื่อนร่วมเดินทาง</p>
                      <p className="text-sm font-bold text-slate-800">{companions[0]?.profile.full_name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{companions[0]?.rating_avg} ({companions[0]?.review_count} รีวิว)</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/customer/companions`}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                  >
                    ดูโปรไฟล์
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR ERRAND CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">ประเภทของธุระ</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            พร้อมร่วมเดินทางในทุกจุดหมายที่คุณต้องการ
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            เลือกประเภทธุระที่ต้องการใช้บริการ เพื่อให้ระบบจัดสรร Companion ที่มีความชำนาญเส้นทางและเข้าใจขั้นตอนมากที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon_name] || Sparkles;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-teal-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1.5">{cat.name_th}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    href={`/customer/bookings/new?category=${cat.id}`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  >
                    <span>จองร่วมเดินทาง</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">ขั้นตอนการใช้บริการ</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ใช้งานง่ายและอุ่นใจเพียง 3 ขั้นตอน
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ระบุความต้องการ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                กรอกประเภทธุระ วัน-เวลา สถานที่ต้นทาง จุดหมาย และความต้องการพิเศษ (เช่น ใช้วีลแชร์ หรือต้องการให้ช่วยถือของ)
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-lg">จับคู่ Companion ที่เหมาะสม</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                เลือก Companion ที่ถูกใจจากโปรไฟล์ รีวิว และพื้นที่บริการ หรือให้ Companion ในพื้นที่เข้ามากดตอบรับคำขอ
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ร่วมเดินทางอย่างสบายใจ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Companion เดินทางมารับถึงหน้าบ้าน อำนวยความสะดวกตลอดการทำธุระ ติดตามสถานะได้แบบเรียลไทม์ และให้คะแนนรีวิวเมื่อเสร็จสิ้น
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COMPANIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">เพื่อนร่วมทางแนะนำ</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Companion ที่ผ่านการยืนยันตัวตน
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              เพื่อนร่วมทางที่พร้อมเดินทาง ช่วยถือของ และอำนวยความสะดวกในเขตกรุงเทพฯ และปริมณฑล
            </p>
          </div>
          <Link
            href="/customer/companions"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
          >
            <span>ดู Companion ทั้งหมด ({companions.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companions.map((comp) => (
            <div
              key={comp.user_id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-4">
                  <img
                    src={comp.profile.avatar_url}
                    alt={comp.profile.full_name}
                    className="w-full h-44 object-cover rounded-xl"
                  />
                  {comp.id_card_verified && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3.5 h-3.5" /> ยืนยันแล้ว
                    </span>
                  )}
                  {comp.is_available ? (
                    <span className="absolute bottom-2.5 left-2.5 bg-teal-900/80 backdrop-blur text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                      ● ว่างรับงาน
                    </span>
                  ) : (
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-800/80 backdrop-blur text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded-md">
                      ○ ไม่สะดวกรับงาน
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-slate-900 text-base">{comp.profile.full_name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{comp.rating_avg}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{comp.bio}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {comp.skills.slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {comp.skills.length > 2 && (
                    <span className="text-[10px] text-slate-400">+{comp.skills.length - 2}</span>
                  )}
                </div>

                {/* Service Areas */}
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{comp.service_areas.join(', ')}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">อัตราค่าบริการ</span>
                  <p className="text-sm font-bold text-teal-600">฿{comp.hourly_rate} <span className="text-xs font-normal text-slate-500">/ ชม.</span></p>
                </div>
                <Link
                  href={`/customer/bookings/new?companionId=${comp.user_id}`}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  เลือกจอง
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SAFETY & HIGHLIGHT SECTION */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> มาตรฐานความปลอดภัยระดับสูงสุด
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                ให้คนในครอบครัวเดินทางอย่างอุ่นใจที่สุด
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                เราคัดกรอง Companion ทุกคนด้วยการตรวจสอบบัตรประชาชน บันทึกประวัติ และกำหนดขอบเขตหน้าที่อย่างชัดเจน
              </p>
              
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span>ตรวจสอบยืนยันตัวตนด้วยบัตรประชาชน 100%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span>ระบบบันทึกไทม์ไลน์การเดินทาง (Timeline Tracking) ตั้งแต่จุดรับจนส่งกลับ</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span>มีข้อมูลผู้ติดต่อฉุกเฉินและเบอร์โทรศัพท์ที่เข้าถึงได้ทันที</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span>ระบบคะแนนและรีวิวโปร่งใสหลังเสร็จสิ้นบริการทุกครั้ง</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-6 space-y-4 text-slate-200">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" /> ทำไมถึงเลือก Care Companion?
              </h3>
              <p className="text-xs leading-relaxed">
                "ในวันที่ลูกหลานต้องทำงานหรือติดประชุมด่วน การปล่อยให้คุณพ่อคุณแม่หรือผู้สูงอายุเดินทางไปโรงพยาบาลหรือทำธุรกรรมคนเดียวมักทำให้เป็นห่วง แต่ด้วย Care Companion เรามีเพื่อนร่วมทางที่ไว้ใจได้ คอยช่วยพยุง ช่วยถือของ และคอยรายงานสถานะให้ลูกหลานทราบตลอดเวลา"
              </p>
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">คุณชัยพร วัฒนาพงษ์</p>
                  <p className="text-slate-400">บุตรชายคุณยายสมศรี (ผู้ใช้งานจริง)</p>
                </div>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  ★★★★★
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">คำถามที่พบบ่อย</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ข้อสงสัยเกี่ยวกับการให้บริการ
          </h2>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">
              1. Care Companion แตกต่างจากบริการพยาบาลหรือผู้ดูแลผู้ป่วยอย่างไร?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Companion ของเราทำหน้าที่เป็น "เพื่อนร่วมทางและผู้อำนวยความสะดวก" ในการเดินทางและการทำธุระ เช่น ช่วยประคองเดิน ช่วยเข็นวีลแชร์ ช่วยถือของ ช่วยกดบัตรคิว หรือเดินเป็นเพื่อน <strong>ไม่ใช่บุคลากรทางการแพทย์ และไม่ได้รับอนุญาตให้ทำการรักษาพยาบาล จ่ายยา หรือทำหัตถการทางการแพทย์ใดๆ</strong>
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">
              2. อัตราค่าบริการคำนวณอย่างไร?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ค่าบริการคำนวณตามจำนวนชั่วโมงที่นัดหมายจริง โดย Companion แต่ละท่านจะระบุอัตราค่าบริการต่อชั่วโมงไว้ในโปรไฟล์อย่างโปร่งใส (เฉลี่ย 200 - 300 บาท/ชม.) ค่าเดินทาง (เช่น ค่าแท็กซี่, ค่ารถไฟฟ้า) จะจ่ายตามจริงระหว่างเดินทาง
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">
              3. เข้าใช้งานระบบด้วยช่องทางใดได้บ้าง?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ผู้ใช้งานทั้ง Customer และ Companion สามารถเข้าสู่ระบบด้วย Google Account ผ่าน Supabase Authentication ได้อย่างสะดวกและปลอดภัย
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
