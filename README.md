# 🤝 Care Companion - แพลตฟอร์มเพื่อนร่วมเดินทางที่อุ่นใจ

> **Assignment + Midterm: พัฒนา Web Application by Next.js (25 คะแนน)**  
> **กำหนดส่ง:** ภายในวันอาทิตย์ที่ 27 กันยายน ก่อนเวลา 24:00 น.  
> **นำเสนอ:** ห้องเรียน IT309 วันพุธที่ 30 กันยายน เวลา 10:00 น.

---

## 📌 บทนำและวัตถุประสงค์ (Project Overview)
ปัจจุบันผู้สูงอายุ ผู้ที่เดินทางคนเดียวไม่สะดวก หรือผู้ที่ต้องการความช่วยเหลือในการเดินทางไปทำธุระ อาจประสบปัญหาเมื่อสมาชิกในครอบครัวติดภารกิจไม่สามารถเดินทางไปด้วยได้ เช่น การไปพบแพทย์ตามนัดที่โรงพยาบาล ไปธนาคาร ติดต่อราชการ หรือซื้อของนอกบ้าน

**“Care Companion”** พัฒนาขึ้นเพื่อเป็นแพลตฟอร์มกลางเชื่อมโยงระหว่าง:
1. **ผู้ที่ต้องการผู้ช่วยร่วมเดินทาง (Customer):** ค้นหาและระบุความต้องการในการเดินทางอย่างโปร่งใส ปลอดภัย
2. **ผู้ให้บริการร่วมเดินทาง (Companion):** อำนวยความสะดวกในการเดินทางและการทำธุระ คอยช่วยพยุง เข็นวีลแชร์ ช่วยถือของ และช่วยประสานงาน
3. **ผู้ดูแลระบบ (Admin):** กำกับดูแลความปลอดภัย ตรวจสอบเอกสารยืนยันตัวตน และบริหารจัดการข้อมูลภาพรวมของระบบ

> ⚠️ **ข้อความสำคัญตามข้อกำหนด (Important Disclaimer):**  
> Companion มีหน้าที่ช่วยเหลือและอำนวยความสะดวกในการเดินทางและการทำธุระเท่านั้น **ไม่ใช่ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย**

---

## 🛠️ Tech Stack ที่กำหนดตามเกณฑ์
- **Frontend / Full Stack Framework:** Next.js 14 (App Router) + TailwindCSS + TypeScript
- **Authentication:** Google Account OAuth ทำงานร่วมกับ Supabase Authentication
- **Database:** Supabase PostgreSQL พร้อมชุดสคริปต์ [schema.sql](file:///c:/kong67/Care-Companion/supabase/schema.sql) และระบบ Row Level Security (RLS)
- **File Storage:** Supabase Storage (Bucket: `care_companion_files`)
- **Deployment:** Vercel Production Ready (Build ผ่าน 100% ไม่มี error)

---

## 👥 บทบาทผู้ใช้งานและฟีเจอร์เด่น (User Roles & Features)

```
Care Companion Architecture
├── 🌐 Public Landing Page
│   ├── ข้อมูลแพลตฟอร์มเบื้องต้นและหมวดหมู่ธุระ
│   ├── ค้นหาและดูโปรไฟล์ Companion ที่ผ่านการยืนยันตัวตน
│   └── มาตรฐานความปลอดภัยและข้อกำหนดการให้บริการ
│
├── 👵 ผู้รับบริการ (Customer Portal)
│   ├── ระบุความต้องการ: ธุระ, วัน-เวลา, สถานที่ต้นทาง-ปลายทาง, ระยะเวลา, ความต้องการพิเศษ
│   ├── ค้นหา/กรอง Companion ตามพื้นที่, ทักษะ (เช่น วีลแชร์, ปฐมพยาบาล CPR, มีรถยนต์), เรตติ้ง
│   ├── ระบบติดตามสถานะแบบเรียลไทม์ (Pending ➜ Accepted ➜ On The Way ➜ In Progress ➜ Completed)
│   ├── ข้อมูลติดต่อฉุกเฉินและเบอร์โทรด่วน (1669, 191)
│   └── ระบบให้คะแนนและรีวิวบริการ (Rating & Review 1-5 ดาว)
│
├── 🤝 เพื่อนร่วมทาง (Companion Portal)
│   ├── นำเสนอข้อมูลตนเอง: Bio, ประสบการณ์, ทักษะ, พื้นที่ให้บริการ, วันสะดวก, อัตราค่าบริการ/ชม.
│   ├── ปุ่มเปิด-ปิดรับงาน (Online/Offline Toggle)
│   ├── กระดานค้นหางาน (Job Board) & กดตอบรับงาน (Accept Job)
│   ├── แผงควบคุมการปฏิบัติงานจริงและอัปเดตสถานะการเดินทาง
│   └── สรุปประวัติการเดินทาง รายได้สะสม และคะแนนรีวิว
│
└── 🛡️ ผู้ดูแลระบบ (Admin Portal)
    ├── แดชบอร์ดสถิติภาพรวม: จำนวนเที่ยวเดินทาง, ยอดการใช้งาน, สถิติแยกตามประเภทธุระ
    ├── จัดการผู้ใช้งาน: ตรวจสอบและอนุมัติบัตรประชาชน Companion (Verification System)
    └── จัดการรายการจองทั้งหมด: ตรวจสอบสถานะการเดินทาง และจัดการข้อพิพาท
```

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. กำหนดค่า Environment Variables
คัดลอกไฟล์ `.env.example` ไปเป็น `.env.local`:
```bash
cp .env.example .env.local
```
*(ระบบมี In-Memory / Demo Engine ในตัว ทำให้สามารถรันและนำเสนอได้ทันที แม้ยังไม่ได้ใส่ API Keys ของ Supabase)*

### 3. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🗄️ การตั้งค่า Supabase (Database & Storage)

### 1. รัน Database Schema
1. เข้าไปที่ [Supabase Dashboard](https://supabase.com/dashboard) ➜ เลือกโปรเจกต์ของคุณ
2. ไปที่เมนู **SQL Editor**
3. คัดลอกโค้ดทั้งหมดในไฟล์ `supabase/schema.sql` วางแล้วกด **Run**
4. ระบบจะสร้าง Tables (`profiles`, `companion_profiles`, `service_categories`, `bookings`, `booking_timeline`, `reviews`), RLS Policies, Triggers และข้อมูลเริ่มต้นให้อัตโนมัติ

### 2. ตั้งค่า Google Authentication
1. ใน Supabase Dashboard ไปที่ **Authentication** ➜ **Providers** ➜ **Google**
2. กดเปิดใช้งาน (Enable) และกรอก **Client ID** กับ **Client Secret** ที่ได้จาก [Google Cloud Console](https://console.cloud.google.com/)
3. คัดลอก Callback URL จาก Supabase ไปใส่ใน **Authorized redirect URIs** ของ Google Console

### 3. ตรวจสอบ Storage Bucket
- ในเมนู **Storage** จะมี Bucket ชื่อ `care_companion_files` สำหรับจัดเก็บรูปโปรไฟล์และเอกสารยืนยันตัวตน

---

## ☁️ การ Deploy ขึ้น Vercel

1. สร้าง GitHub Repository แล้ว Push โค้ดขึ้นไป:
   ```bash
   git add .
   git commit -m "feat: complete Care Companion full-stack web application"
   git push origin main
   ```
2. ไปที่ [Vercel Dashboard](https://vercel.com/) ➜ กด **Add New Project** ➜ เลือก GitHub Repo
3. ในส่วน **Environment Variables** ให้ใส่ค่าจาก `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. กด **Deploy** และรอประมาณ 1 นาที จะได้ลิงก์ Production พร้อมส่งงานทันที

---

## 🎯 แนะนำสำหรับการนำเสนอหน้าชั้นเรียน (ห้อง IT309)
เพื่อความสะดวกในการสุ่มเรียกนำเสนอ ได้เตรียมแถบ **IT309 Demo Switcher** ไว้ที่ด้านบนสุดของทุกหน้าจอ:
- **ปุ่ม 👵 ผู้รับบริการ (Customer):** แสดงหน้าจอของคุณยายสมศรี ทดสอบสร้างคำขอ, ค้นหา Companion, ดูไทม์ไลน์
- **ปุ่ม 🤝 เพื่อนร่วมทาง (Companion):** แสดงหน้าจอของน้องเมย์ ทดสอบเปิดรับงาน, กดรับคำขอ, อัปเดตสถานะการเดินทาง
- **ปุ่ม 🛡️ ผู้ดูแลระบบ (Admin):** แสดงหน้าจอผู้ดูแลระบบ ตรวจสอบสถิติภาพรวม และกดอนุมัติยืนยันตัวตน Companion
- **ปุ่ม 🔄 รีเซ็ตข้อมูล:** สามารถกดรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นได้ทุกเมื่อ
