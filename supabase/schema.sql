-- ====================================================================
-- Care Companion - Database Schema (Supabase PostgreSQL)
-- Description: Complete schema for Care Companion Web Application
-- Roles: Customer, Companion, Admin
-- Tech Stack: Next.js + TailwindCSS + Supabase Auth + Supabase DB + Storage
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'companion', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE errand_category_type AS ENUM ('hospital', 'bank', 'government', 'shopping', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    address TEXT,
    emergency_contact JSONB, -- { "name": "...", "phone": "...", "relation": "..." }
    health_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COMPANION PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.companion_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    hourly_rate NUMERIC(10, 2) DEFAULT 250.00,
    service_areas TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    vehicle_type TEXT DEFAULT 'walk_public', -- walk_public, car, motorcycle
    id_card_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating_avg NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    completed_trips INTEGER DEFAULT 0,
    available_days TEXT[] DEFAULT ARRAY['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.service_categories (
    id errand_category_type PRIMARY KEY,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    companion_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category errand_category_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 3,
    special_needs TEXT,
    notes TEXT,
    status booking_status NOT NULL DEFAULT 'pending',
    estimated_price NUMERIC(10, 2) NOT NULL DEFAULT 750.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BOOKING TIMELINE TABLE
CREATE TABLE IF NOT EXISTS public.booking_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status booking_status NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    companion_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view; Users can edit their own; Admins can edit any
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Companion Profiles: Anyone can view; Companion can edit their own; Admins can edit any
CREATE POLICY "Companion profiles are viewable by everyone" ON public.companion_profiles
    FOR SELECT USING (true);

CREATE POLICY "Companions can update own profile" ON public.companion_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Service Categories: Public read
CREATE POLICY "Categories viewable by all" ON public.service_categories
    FOR SELECT USING (true);

-- Bookings: Customers can view/create their own; Companions can view open and assigned bookings; Admin full access
CREATE POLICY "Customers can see own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = customer_id OR 
        auth.uid() = companion_id OR 
        status = 'pending' OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants and admins can update booking" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = customer_id OR 
        auth.uid() = companion_id OR 
        (companion_id IS NULL AND status = 'pending') OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Timeline: Visible to booking participants and admins
CREATE POLICY "Timeline viewable by booking participants" ON public.booking_timeline
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = booking_timeline.booking_id 
            AND (b.customer_id = auth.uid() OR b.companion_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- Reviews: Viewable by all; Only customer of booking can insert
CREATE POLICY "Reviews viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ====================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ====================================================================
-- Bucket: 'care_companion_files' for profile photos and document proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('care_companion_files', 'care_companion_files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for care_companion_files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'care_companion_files');

CREATE POLICY "Authenticated users can upload files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'care_companion_files' AND auth.role() = 'authenticated');

-- ====================================================================
-- SEED DATA
-- ====================================================================
INSERT INTO public.service_categories (id, name_th, name_en, description, icon_name, color)
VALUES
    ('hospital', 'พบแพทย์ / ไปโรงพยาบาล', 'Medical Appointment', 'ช่วยพาไปรับการตรวจ ติดตามผลแพทย์ รับยา และทำบัตรนัด (อำนวยความสะดวกในการเดินทางเท่านั้น ไม่ใช่การรักษาพยาบาล)', 'Stethoscope', 'emerald'),
    ('bank', 'ไปธนาคาร / ธุรกรรมการเงิน', 'Bank & Finance', 'ช่วยเหลือการเดินทางไปธนาคาร กดเงิน อัปเดตสมุดบัญชีอย่างปลอดภัย', 'Landmark', 'blue'),
    ('government', 'ติดต่อหน่วยงานราชการ', 'Government Office', 'พาไปติดต่อสำนักงานเขต ประกันสังคม ข้อมูลภาษี หรือเบี้ยยังชีพผู้สูงอายุ', 'Building2', 'amber'),
    ('shopping', 'ซื้อของ / จ่ายตลาด / ซูเปอร์', 'Shopping & Grocery', 'ช่วยถือของ เข็นรถ ช่วยเลือกสินค้าตามรายการที่ต้องการ', 'ShoppingBag', 'purple'),
    ('general', 'ทำธุระทั่วไปนอกบ้าน', 'General Errand', 'ไปทำบุญ เยี่ยมญาติ ตัดผม ทานอาหาร หรือเดินเล่นผ่อนคลายในสวนสาธารณะ', 'Sparkles', 'rose')
ON CONFLICT (id) DO NOTHING;

-- TRIGGER: Automatic profile creation on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
