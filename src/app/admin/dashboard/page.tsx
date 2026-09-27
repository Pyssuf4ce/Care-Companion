'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/data/mock-data';
import { 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { companions, bookings, setCompanionVerification } = useApp();

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const activeBookings = bookings.filter(b => ['accepted', 'on_the_way', 'in_progress'].includes(b.status));
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const totalVolume = bookings.reduce((sum, b) => sum + b.estimated_price, 0);
  const totalVerifiedCompanions = companions.filter(c => c.id_card_verified).length;

  // Breakdown by category
  const categoryCounts = CATEGORIES.map(cat => {
    const count = bookings.filter(b => b.category === cat.id).length;
    return { ...cat, count };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>ระบบบริหารจัดการส่วนกลาง (Admin Platform Console)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ภาพรวมแพลตฟอร์ม Care Companion
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            รายงานสถิติการใช้งาน จัดการข้อมูลผู้ใช้ และกำกับดูแลความปลอดภัยของระบบ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
          >
            จัดการผู้ใช้งาน
          </Link>
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
          >
            ตรวจสอบการจองทั้งหมด
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">เที่ยวเดินทางทั้งหมด</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalBookings}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <span className="text-emerald-600 font-semibold">สำเร็จ {completedBookings.length}</span>
            <span>•</span>
            <span className="text-teal-600 font-semibold">กำลังดำเนินการ {activeBookings.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Companion ในระบบ</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{companions.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold pt-1">
            ✓ ยืนยันบัตร ปชช. แล้ว {totalVerifiedCompanions} ท่าน
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">มูลค่าบริการสะสม</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">฿{totalVolume.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 pt-1">
            เฉลี่ย ฿{(totalVolume / (totalBookings || 1)).toFixed(0)} ต่อเที่ยว
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">เรตติ้งความพึงพอใจ</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.94 / 5.0</p>
          <p className="text-[11px] text-amber-600 font-semibold pt-1">
            จาก 100% ของผู้รับบริการที่รีวิว
          </p>
        </div>
      </div>

      {/* Categories Breakdown & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Errand Categories Analytics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              สัดส่วนคำขอตามประเภทของธุระ (Errand Distribution)
            </h3>
            <span className="text-xs text-slate-400">คำขอทั้งหมด {totalBookings} รายการ</span>
          </div>

          <div className="space-y-4">
            {categoryCounts.map((cat) => {
              const percentage = totalBookings > 0 ? Math.round((cat.count / totalBookings) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name_th}</span>
                    <span className="text-slate-500 font-semibold">{cat.count} รายการ ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Companion Verification Quick Actions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              การอนุมัติ Companion
            </h3>
            <Link href="/admin/users" className="text-xs text-purple-600 font-semibold hover:underline">
              ดูทั้งหมด
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            ตรวจสอบบัตรประชาชนและยืนยันสถานะความปลอดภัยของ Companion
          </p>

          <div className="space-y-3 pt-1">
            {companions.slice(0, 4).map((comp) => (
              <div
                key={comp.user_id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={comp.profile.avatar_url}
                    alt={comp.profile.full_name}
                    className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{comp.profile.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{comp.service_areas[0]}</p>
                  </div>
                </div>

                <button
                  onClick={() => setCompanionVerification(comp.user_id, !comp.id_card_verified)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex-shrink-0 ${
                    comp.id_card_verified
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-700'
                      : 'bg-amber-100 text-amber-800 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  {comp.id_card_verified ? '✓ ยืนยันแล้ว' : '+ กดยืนยัน'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Monitoring */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            รายการจองล่าสุดบนแพลตฟอร์ม
          </h3>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>ดูรายการจองทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">รหัสจอง</th>
                <th className="py-3 px-4">ชื่อธุระ</th>
                <th className="py-3 px-4">ผู้รับบริการ</th>
                <th className="py-3 px-4">เพื่อนร่วมทาง</th>
                <th className="py-3 px-4">วัน-เวลา</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">ค่าบริการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-teal-700">#{b.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">{b.title}</td>
                  <td className="py-3 px-4">{b.customer.full_name}</td>
                  <td className="py-3 px-4">{b.companion ? b.companion.profile.full_name : <span className="text-amber-600 font-medium">รอการตอบรับ</span>}</td>
                  <td className="py-3 px-4">{b.appointment_date} {b.start_time} น.</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">฿{b.estimated_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
