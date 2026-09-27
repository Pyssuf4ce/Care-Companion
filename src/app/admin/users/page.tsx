'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_CUSTOMERS, MOCK_ADMIN } from '@/lib/data/mock-data';
import { 
  Search, 
  ShieldAlert, 
  Phone, 
  Mail, 
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '@/types';

export default function AdminUsersPage() {
  const { companions, setCompanionVerification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');

  // Combine mock customers, companion profiles, and admin
  const allUsers = [
    ...MOCK_CUSTOMERS.map(c => ({
      ...c,
      isCompanion: false,
      companionData: null,
    })),
    ...companions.map(c => ({
      ...c.profile,
      isCompanion: true,
      companionData: c,
    })),
    {
      ...MOCK_ADMIN,
      isCompanion: false,
      companionData: null,
    },
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSearch = 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">การบริหารจัดการ</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          จัดการข้อมูลผู้ใช้งานระบบ (User Management)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ตรวจสอบและกำกับดูแลบัญชีผู้รับบริการ (Customer), เพื่อนร่วมทาง (Companion), และผู้ดูแลระบบ (Admin)
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
              placeholder="ค้นหาชื่อผู้ใช้, อีเมล หรือเบอร์โทรศัพท์..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm bg-white"
            >
              <option value="all">👥 ทุกบทบาทผู้ใช้งาน</option>
              <option value="customer">👵 ผู้รับบริการ (Customer)</option>
              <option value="companion">🤝 เพื่อนร่วมทาง (Companion)</option>
              <option value="admin">🛡️ ผู้ดูแลระบบ (Admin)</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>พบผู้ใช้ในระบบทั้งหมด <strong>{filteredUsers.length}</strong> บัญชี</span>
          <span>Companion ที่ยืนยันตัวตนแล้ว: {companions.filter(c => c.id_card_verified).length} / {companions.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-4 px-5">ผู้ใช้งาน</th>
                <th className="py-4 px-5">บทบาท</th>
                <th className="py-4 px-5">ข้อมูลติดต่อ</th>
                <th className="py-4 px-5">สถานะยืนยันบัตร ปชช.</th>
                <th className="py-4 px-5">พื้นที่ / สถิติ</th>
                <th className="py-4 px-5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => {
                const isCompanion = user.isCompanion && user.companionData;
                const verified = isCompanion ? user.companionData.id_card_verified : true;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* User info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-4 px-5">
                      {user.role === 'customer' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          👵 Customer
                        </span>
                      )}
                      {user.role === 'companion' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          🤝 Companion
                        </span>
                      )}
                      {user.role === 'admin' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          🛡️ Admin
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-5 space-y-0.5">
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.email}</span>
                      </p>
                      {user.phone && (
                        <p className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.phone}</span>
                        </p>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-5">
                      {isCompanion ? (
                        verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> อนุมัติแล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> รอการตรวจสอบ
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-400">ระบบปกติ</span>
                      )}
                    </td>

                    {/* Stats or Area */}
                    <td className="py-4 px-5 text-slate-500">
                      {isCompanion ? (
                        <div>
                          <p className="text-slate-800 font-semibold">
                            ★ {user.companionData.rating_avg} ({user.companionData.completed_trips} งาน)
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {user.companionData.service_areas[0]}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-600 truncate max-w-[180px]">
                          {user.address || 'กทม.'}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {isCompanion && (
                        <button
                          onClick={() => setCompanionVerification(user.id, !verified)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            verified
                              ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {verified ? 'ยกเลิกการยืนยัน' : 'อนุมัติยืนยันตัวตน'}
                        </button>
                      )}
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
