import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Care Companion - เพื่อนร่วมทางที่อุ่นใจ ไปไหนก็ไม่ต้องกังวล',
  description: 'แพลตฟอร์มกลางเชื่อมโยงผู้ที่ต้องการผู้ช่วยร่วมเดินทาง (Customer) กับผู้ให้บริการร่วมเดินทาง (Companion) สำหรับพบแพทย์ ทำธุรกรรมธนาคาร ติดต่อราชการ และทำธุระนอกบ้าน',
  keywords: 'Care Companion, เพื่อนร่วมทาง, ผู้ช่วยผู้สูงอายุ, ไปหาหมอ, เดินทางทำธุระ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
