'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function CompanionsPage() {
  const { companions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'rate_asc' | 'trips'>('rating');

  // Extract unique areas and skills from companions
  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    companions.forEach(c => c.service_areas.forEach(a => areas.add(a)));
    return Array.from(areas);
  }, [companions]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    companions.forEach(c => c.skills.forEach(s => skills.add(s)));
    return Array.from(skills);
  }, [companions]);

  // Filter and sort companions
  const filteredCompanions = useMemo(() => {
    return companions
      .filter((c) => {
        const matchesSearch = 
          c.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.service_areas.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesArea = selectedArea === 'all' || c.service_areas.includes(selectedArea);
        const matchesSkill = selectedSkill === 'all' || c.skills.includes(selectedSkill);
        const matchesAvailable = !onlyAvailable || c.is_available;

        return matchesSearch && matchesArea && matchesSkill && matchesAvailable;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
        if (sortBy === 'rate_asc') return a.hourly_rate - b.hourly_rate;
        if (sortBy === 'trips') return b.completed_trips - a.completed_trips;
        return 0;
      });
  }, [companions, searchTerm, selectedArea, selectedSkill, onlyAvailable, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">ค้นหาเพื่อนร่วมทาง</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          เลือก Companion ที่ตรงใจและสะดวกในพื้นที่ของคุณ
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          ผู้ให้บริการร่วมเดินทางทุกคนผ่านการยืนยันตัวตน มีประสบการณ์ และระบุข้อมูลพื้นที่ให้บริการอย่างชัดเจน
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ, เขต หรือทักษะ..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm"
            />
          </div>

          {/* Area Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">📍 ทุกพื้นที่ให้บริการ</option>
              {allAreas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">✨ ทักษะความเชี่ยวชาญทั้งหมด</option>
              {allSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm bg-white"
            >
              <option value="rating">คะแนนรีวิวสูงสุด</option>
              <option value="rate_asc">ค่าบริการต่ำสุด</option>
              <option value="trips">เที่ยวเดินทางสูงสุด</option>
            </select>
          </div>

        </div>

        {/* Toggle options */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="font-medium">แสดงเฉพาะผู้ที่เปิดรับงานในขณะนี้</span>
          </label>

          <span className="text-slate-500">
            พบ Companion ที่ตรงเงื่อนไข <strong>{filteredCompanions.length}</strong> ท่าน
          </span>
        </div>
      </div>

      {/* Companions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanions.map((comp) => (
          <div
            key={comp.user_id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              
              {/* Profile Card Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={comp.profile.avatar_url}
                    alt={comp.profile.full_name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-sm"
                  />
                  {comp.is_available ? (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="ว่างรับงาน" />
                  ) : (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-400 ring-2 ring-white" title="ไม่สะดวกรับงาน" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{comp.profile.full_name}</h3>
                    {comp.id_card_verified && (
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> ยืนยันแล้ว
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {comp.rating_avg}
                    </span>
                    <span>•</span>
                    <span>{comp.review_count} รีวิว</span>
                    <span>•</span>
                    <span>{comp.completed_trips} งานสำเร็จ</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{comp.bio}"
              </p>

              {/* Skills */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  ความเชี่ยวชาญ & ทักษะ
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-teal-50 text-teal-800 font-medium px-2 py-0.5 rounded-lg border border-teal-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  พื้นที่ให้บริการ
                </span>
                <p className="text-xs text-slate-600 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{comp.service_areas.join(', ')}</span>
                </p>
              </div>

              {/* Available Days */}
              {comp.available_days && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>ช่วงเวลาสะดวก: {comp.available_days.join(', ')}</span>
                </div>
              )}

            </div>

            {/* Price & Action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">อัตราค่าบริการ</span>
                <p className="text-base font-bold text-teal-700">
                  ฿{comp.hourly_rate} <span className="text-xs font-normal text-slate-500">/ ชม.</span>
                </p>
              </div>

              <Link
                href={`/customer/bookings/new?companionId=${comp.user_id}`}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 group"
              >
                <span>เลือกจองร่วมเดินทาง</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
