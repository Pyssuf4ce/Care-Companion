import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldAlert, Phone, Mail, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Important Disclaimer Banner as specified in Assignment */}
      <div className="bg-amber-950/70 border-b border-amber-800/50 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-amber-200 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-amber-300 font-semibold">ข้อความสำคัญ (Important Notice): </strong>
            ผู้ให้บริการร่วมเดินทาง (Companion) มีหน้าที่ช่วยเหลือและอำนวยความสะดวกในการเดินทางและการทำธุระเท่านั้น 
            <span className="text-amber-100 font-semibold underline ml-1">
              ไม่ใช่ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-900 shadow">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Care Companion</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              แพลตฟอร์มกลางเชื่อมโยงผู้ที่ต้องการผู้ช่วยร่วมเดินทาง กับผู้ให้บริการร่วมเดินทางที่ผ่านการตรวจสอบ เพื่อความอุ่นใจในทุกการเดินทางและการทำธุระ
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Award className="w-4 h-4" />
              <span>Assignment + Midterm Web Application</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              สำหรับผู้รับบริการ (Customer)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/customer/bookings/new" className="hover:text-teal-400 transition">สร้างคำขอร่วมเดินทาง</Link></li>
              <li><Link href="/customer/companions" className="hover:text-teal-400 transition">ค้นหา Companion ที่พร้อมดูแล</Link></li>
              <li><Link href="/customer/dashboard" className="hover:text-teal-400 transition">ติดตามสถานะการเดินทาง</Link></li>
              <li><Link href="/#safety" className="hover:text-teal-400 transition">มาตรฐานความปลอดภัย</Link></li>
            </ul>
          </div>

          {/* Companion Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              สำหรับเพื่อนร่วมทาง (Companion)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/companion/jobs" className="hover:text-teal-400 transition">กระดานค้นหางานบริการ</Link></li>
              <li><Link href="/companion/dashboard" className="hover:text-teal-400 transition">แดชบอร์ดงานและรายได้</Link></li>
              <li><Link href="/companion/profile" className="hover:text-teal-400 transition">จัดการโปรไฟล์และพื้นที่บริการ</Link></li>
              <li><Link href="/auth/login" className="hover:text-teal-400 transition">สมัครเป็น Companion ร่วมเดินทาง</Link></li>
            </ul>
          </div>

          {/* Tech Stack & Submission Info */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              ระบบและการส่งงาน
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• Framework: Next.js 14 + TailwindCSS</p>
              <p>• Auth: Google OAuth + Supabase Auth</p>
              <p>• Database & Storage: Supabase PostgreSQL</p>
              <p>• Deployment: Vercel Production Ready</p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <span>กำหนดส่ง: 27 ก.ย. ก่อน 24.00 น.</span>
                <span className="block text-teal-400">ห้องสอบบรรยาย: IT309</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Care Companion Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Phone className="w-3.5 h-3.5" /> สายด่วนช่วยเหลือ: 02-123-4567
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Mail className="w-3.5 h-3.5" /> support@carecompanion.app
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
