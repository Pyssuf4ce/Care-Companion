'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  HeartHandshake, 
  User, 
  ShieldCheck, 
  Briefcase, 
  Calendar, 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronDown, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, switchRole, resetToDefault } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Navigation Links depending on user role
  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'customer':
        return [
          { href: '/', label: 'หน้าหลัก', icon: HeartHandshake },
          { href: '/customer/dashboard', label: 'การจองของฉัน', icon: Calendar },
          { href: '/customer/companions', label: 'ค้นหา Companion', icon: Search },
          { href: '/customer/bookings/new', label: 'สร้างคำขอร่วมเดินทาง', icon: PlusCircle, highlight: true },
        ];
      case 'companion':
        return [
          { href: '/', label: 'หน้าหลัก', icon: HeartHandshake },
          { href: '/companion/dashboard', label: 'แดชบอร์ดงาน', icon: Briefcase },
          { href: '/companion/jobs', label: 'กระดานหางาน', icon: Search },
          { href: '/companion/profile', label: 'โปรไฟล์ & พื้นที่บริการ', icon: User },
        ];
      case 'admin':
        return [
          { href: '/', label: 'หน้าหลัก', icon: HeartHandshake },
          { href: '/admin/dashboard', label: 'ภาพรวมระบบ & สถิติ', icon: ShieldCheck },
          { href: '/admin/users', label: 'จัดการผู้ใช้งาน', icon: User },
          { href: '/admin/bookings', label: 'รายการจองทั้งหมด', icon: Calendar },
        ];
      default:
        return [
          { href: '/', label: 'หน้าหลัก', icon: HeartHandshake },
          { href: '/customer/companions', label: 'ค้นหา Companion', icon: Search },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleRoleSelect = (role: 'customer' | 'companion' | 'admin') => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'customer') router.push('/customer/dashboard');
    else if (role === 'companion') router.push('/companion/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
  };

  return (
    <>
      {/* Midterm Demo Quick Switcher Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white text-xs py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" /> IT309 Demo Mode
            </span>
            <span className="hidden sm:inline text-slate-300">
              สลับมุมมองทดสอบระบบได้ทันที:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleRoleSelect('customer')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentUser.role === 'customer'
                  ? 'bg-teal-500 text-white shadow-sm ring-1 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              👵 ผู้รับบริการ (Customer)
            </button>
            <button
              onClick={() => handleRoleSelect('companion')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentUser.role === 'companion'
                  ? 'bg-teal-500 text-white shadow-sm ring-1 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              🤝 เพื่อนร่วมทาง (Companion)
            </button>
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm ring-1 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              🛡️ ผู้ดูแลระบบ (Admin)
            </button>
            <button
              onClick={() => {
                if (confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?')) {
                  resetToDefault();
                }
              }}
              title="รีเซ็ตข้อมูลตัวอย่าง"
              className="p-1 rounded bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent block leading-tight">
                    Care Companion
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                    เพื่อนร่วมเดินทางที่อุ่นใจ
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      link.highlight
                        ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow'
                        : isActive
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile & Role Pill */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all bg-white"
                >
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left text-xs">
                    <p className="font-medium text-slate-800 leading-tight max-w-[130px] truncate">
                      {currentUser.full_name}
                    </p>
                    <span className="text-[11px] text-teal-600 font-semibold uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">เข้าสู่ระบบด้วย Google</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{currentUser.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => handleRoleSelect('customer')}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.role === 'customer' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-700'
                        }`}
                      >
                        <span>👵 เข้าสู่พอร์ทัล Customer</span>
                        {currentUser.role === 'customer' && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSelect('companion')}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.role === 'companion' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-700'
                        }`}
                      >
                        <span>🤝 เข้าสู่พอร์ทัล Companion</span>
                        {currentUser.role === 'companion' && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSelect('admin')}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.role === 'admin' ? 'text-purple-700 font-bold bg-purple-50' : 'text-slate-700'
                        }`}
                      >
                        <span>🛡️ เข้าสู่พอร์ทัล Admin</span>
                        {currentUser.role === 'admin' && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <Link
                        href="/auth/login"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="block px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      >
                        หน้าเข้าสู่ระบบ / สลับบัญชี Google
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
            <div className="pb-2 border-b border-slate-100 flex items-center gap-2.5">
              {currentUser.avatar_url && (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800">{currentUser.full_name}</p>
                <p className="text-xs text-teal-600 font-medium capitalize">บทบาท: {currentUser.role}</p>
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      link.highlight
                        ? 'bg-teal-600 text-white'
                        : isActive
                        ? 'bg-teal-50 text-teal-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
