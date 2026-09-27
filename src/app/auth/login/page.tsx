'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createClient } from '@/lib/supabase/client';
import { 
  HeartHandshake, 
  User, 
  Briefcase, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '@/types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { switchRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Sign in with Google via Supabase Auth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
        },
      });

      if (error) {
        console.warn('Supabase OAuth notice:', error.message);
        setMessage('เชื่อมต่อ Supabase Auth จำลอง (หรือใช้ Quick Demo บัญชีด้านล่าง)');
        switchRole(selectedRole);
        setTimeout(() => {
          navigateToRole(selectedRole);
        }, 800);
      }
    } catch (err: any) {
      console.warn('OAuth fallback triggered:', err);
      switchRole(selectedRole);
      navigateToRole(selectedRole);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    navigateToRole(role);
  };

  const navigateToRole = (role: UserRole) => {
    if (role === 'customer') router.push('/customer/dashboard');
    else if (role === 'companion') router.push('/companion/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            เข้าสู่ระบบ Care Companion
          </h2>
          <p className="text-xs text-slate-500">
            ระบบความร่วมมือเชื่อมโยงผู้ช่วยร่วมเดินทาง ปลอดภัย เชื่อถือได้
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            เลือกบทบาทที่คุณต้องการเข้าใช้งาน:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'customer'
                  ? 'border-teal-500 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <User className="w-4 h-4 text-teal-600" />
                {selectedRole === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <div>
                <p className="text-xs font-bold">ผู้รับบริการ</p>
                <p className="text-[10px] text-slate-500">หาผู้ช่วยร่วมเดินทาง</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('companion')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'companion'
                  ? 'border-teal-500 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Briefcase className="w-4 h-4 text-teal-600" />
                {selectedRole === 'companion' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <div>
                <p className="text-xs font-bold">เพื่อนร่วมทาง</p>
                <p className="text-[10px] text-slate-500">ให้บริการร่วมเดินทาง</p>
              </div>
            </button>
          </div>
        </div>

        {/* Primary Action: Google Account Login */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.14C3.25 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.24 6.59l4.04 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google Account'}</span>
          </button>

          {message && (
            <p className="text-[11px] text-teal-700 bg-teal-50 p-2 rounded-lg text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{message}</span>
            </p>
          )}

          <p className="text-[11px] text-slate-400 text-center">
            ระบบทำงานร่วมกับ Supabase Authentication เพื่อความปลอดภัยสูงสุด
          </p>
        </div>

        {/* Quick Demo Section */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Login (สำหรับการตรวจงาน)
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 text-xs flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👵</span>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-teal-700">คุณยายสมศรี (Customer)</p>
                  <p className="text-[10px] text-slate-400">ทดสอบสร้างคำขอ, ค้นหา Companion, ดูไทม์ไลน์</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('companion')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 text-xs flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-teal-700">น้องเมย์ กานต์พิชชา (Companion)</p>
                  <p className="text-[10px] text-slate-400">ทดสอบกดรับงาน, อัปเดตสถานะ, ดูรายได้</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 text-xs flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-purple-700">ผู้ดูแลระบบ (Admin IT309)</p>
                  <p className="text-[10px] text-slate-400">ดูสถิติแพลตฟอร์ม, อนุมัติบัตร ปชช., จัดการการจอง</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
