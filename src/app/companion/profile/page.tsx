'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Upload
} from 'lucide-react';

const BANGKOK_AREAS = [
  'เขตพระนคร', 'เขตดุสิต', 'เขตปทุมวัน', 'เขตบางรัก', 'เขตสาทร',
  'เขตจตุจักร', 'เขตพญาไท', 'เขตลาดพร้าว', 'เขตดอนเมือง', 'เขตบางซื่อ',
  'เขตดินแดง', 'เขตราชเทวี', 'เขตคลองเตย', 'เขตยานนาวา', 'เขตบางกอกน้อย',
  'เขตบางกอกใหญ่', 'เขตธนบุรี', 'เขตภาษีเจริญ', 'นนทบุรี', 'สมุทรปราการ'
];

const SKILL_OPTIONS = [
  'ชำนาญการใช้วีลแชร์',
  'ผ่านการอบรม CPR/First Aid',
  'ใจเย็นและสื่อสารชัดเจน',
  'ช่วยจดคำแนะนำแพทย์',
  'มีรถยนต์ส่วนตัว',
  'ชำนาญขั้นตอนเอกสารราชการ',
  'ภาษาอังกฤษระดับดี',
  'ช่วยยกของหนักได้',
];

const DAYS_OF_WEEK = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

export default function CompanionProfilePage() {
  const { currentUser, companions } = useApp();
  const companion = companions.find(c => c.user_id === currentUser.id) || companions[0];

  const [bio, setBio] = useState(companion.bio);
  const [hourlyRate, setHourlyRate] = useState(companion.hourly_rate);
  const [serviceAreas, setServiceAreas] = useState<string[]>(companion.service_areas);
  const [skills, setSkills] = useState<string[]>(companion.skills);
  const [availableDays, setAvailableDays] = useState<string[]>(companion.available_days || DAYS_OF_WEEK);
  const [vehicleType, setVehicleType] = useState(companion.vehicle_type || 'walk_public');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleArea = (area: string) => {
    if (serviceAreas.includes(area)) {
      setServiceAreas(serviceAreas.filter(a => a !== area));
    } else {
      setServiceAreas([...serviceAreas, area]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">การจัดการโปรไฟล์</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          โปรไฟล์และข้อมูลการให้บริการ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          นำเสนอประสบการณ์ ความเชี่ยวชาญ และพื้นที่ที่คุณสะดวก เพื่อให้ Customer เลือกจองคุณด้วยความมั่นใจ
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Info & ID Verification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <img
                src={companion.profile.avatar_url}
                alt={companion.profile.full_name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{companion.profile.full_name}</h3>
                <p className="text-xs text-slate-500">{companion.profile.email} • {companion.profile.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-amber-500">★ {companion.rating_avg}</span>
                  <span className="text-xs text-slate-400">({companion.review_count} รีวิว)</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold">สถานะยืนยันตัวตนแล้ว</p>
                <p className="text-[10px] text-emerald-600">บัตรประชาชนผ่านการตรวจสอบจาก Admin</p>
              </div>
            </div>
          </div>

          {/* Bio / Introduction */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              คำแนะนำตัวและประสบการณ์ (Bio & Experience) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="เล่าประสบการณ์ บุคลิกภาพ และความตั้งใจในการดูแลร่วมเดินทาง..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
          </div>

          {/* Hourly Rate & Vehicle Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                อัตราค่าบริการ (บาท / ชั่วโมง) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={100}
                  max={1000}
                  step={10}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-teal-700"
                />
                <span className="absolute right-3.5 top-3 text-xs text-slate-400">฿ / ชม.</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">แนะนำ 200 - 300 บาท/ชม.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                พาหนะ / รูปแบบการเดินทางหลัก
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
              >
                <option value="walk_public">🚶 ขนส่งสาธารณะ / รถแท็กซี่ / เดิน</option>
                <option value="car">🚗 มีรถยนต์ส่วนตัว (ขับรับ-ส่งได้)</option>
                <option value="motorcycle">🛵 มีรถจักรยานยนต์</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            ทักษะความสามารถพิเศษ (Skills & Certifications)
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => {
              const isSelected = skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 block">
              พื้นที่ที่คุณสะดวกให้บริการ (Service Areas)
            </label>
            <span className="text-xs text-slate-400">เลือกอย่างน้อย 1 พื้นที่</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BANGKOK_AREAS.map((area) => {
              const isSelected = serviceAreas.includes(area);
              return (
                <button
                  type="button"
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? `📍 ${area}` : area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Days */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            วันที่สะดวกรับงานเป็นประจำ (Available Days)
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = availableDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supabase Storage Upload Demonstration Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-900 block">
            เอกสารยืนยันตัวตน & ใบรับรอง (Supabase Storage Bucket: care_companion_files)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:bg-slate-50 transition cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">อัปโหลดเอกสารยืนยันตัวตน หรือใบรับรองการอบรมปฐมพยาบาล</p>
            <p className="text-[11px] text-slate-400">รองรับไฟล์ JPG, PNG หรือ PDF ขนาดไม่เกิน 5MB</p>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              บันทึกข้อมูลเรียบร้อยแล้ว
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลง</span>
          </button>
        </div>

      </form>
    </div>
  );
}
