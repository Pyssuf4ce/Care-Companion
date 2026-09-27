'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BookingStatus } from '@/types';
import { 
  Search, 
  Eye, 
  XCircle
} from 'lucide-react';

const STATUS_BADGES: Record<BookingStatus, { label: string; class: string }> = {
  pending: { label: 'รอรับงาน (Pending)', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted: { label: 'ตอบรับแล้ว (Accepted)', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  on_the_way: { label: 'กำลังเดินทางไปรับ', class: 'bg-purple-50 text-purple-700 border-purple-200' },
  in_progress: { label: 'อยู่ระหว่างทำธุระ', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'สิ้นสุดบริการเรียบร้อย', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelled: { label: 'ยกเลิก', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.companion && b.companion.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">การบริหารจัดการการจอง</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          รายการจองทั้งหมดในระบบ (All Bookings)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ติดตามและกำกับดูแลทุกเที่ยวเดินทาง ตรวจสอบสถานะ และแก้ไขข้อพิพาทในระบบ
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารหัสจอง, ชื่องาน, หรือชื่อผู้ใช้งาน..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">📑 ทุกสถานะการจอง</option>
              <option value="pending">รอรับงาน (Pending)</option>
              <option value="accepted">ตอบรับแล้ว (Accepted)</option>
              <option value="on_the_way">กำลังเดินทางไปรับ (On The Way)</option>
              <option value="in_progress">อยู่ระหว่างทำธุระ (In Progress)</option>
              <option value="completed">สิ้นสุดบริการเรียบร้อย (Completed)</option>
              <option value="cancelled">ยกเลิก (Cancelled)</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>พบรายการจองทั้งหมด <strong>{filteredBookings.length}</strong> รายการ</span>
          <span>มูลค่ารวม: ฿{filteredBookings.reduce((sum, b) => sum + b.estimated_price, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-4 px-5">รหัสจอง & ธุระ</th>
                <th className="py-4 px-5">ผู้รับบริการ</th>
                <th className="py-4 px-5">เพื่อนร่วมทาง</th>
                <th className="py-4 px-5">วัน & เวลานัด</th>
                <th className="py-4 px-5">สถานะ</th>
                <th className="py-4 px-5 text-right">ค่าบริการ</th>
                <th className="py-4 px-5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => {
                const badge = STATUS_BADGES[b.status] || STATUS_BADGES.pending;

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    
                    <td className="py-4 px-5">
                      <span className="font-mono text-teal-700 font-bold block">#{b.id}</span>
                      <p className="font-bold text-slate-900 text-sm max-w-[220px] truncate">{b.title}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        ปลายทาง: {b.destination_address}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.customer.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                          alt={b.customer.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-800">{b.customer.full_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      {b.companion ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={b.companion.profile.avatar_url}
                            alt={b.companion.profile.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-800">{b.companion.profile.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          ยังไม่มีคนรับ
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-800">{b.appointment_date}</p>
                      <p className="text-slate-400">{b.start_time} น. ({b.duration_hours} ชม.)</p>
                    </td>

                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right font-bold text-slate-900 text-sm">
                      ฿{b.estimated_price}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/customer/bookings/${b.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                          title="ตรวจสอบสถานะไทม์ไลน์"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            onClick={() => {
                              if (confirm(`ต้องการยกเลิกคำขอ #${b.id} หรือไม่?`)) {
                                updateBookingStatus(b.id, 'cancelled', 'ยกเลิกโดยผู้ดูแลระบบ');
                              }
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                            title="ยกเลิกคำขอ"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
