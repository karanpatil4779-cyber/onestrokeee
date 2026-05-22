-- ONESTROKE PRODUCTION SCHEMA
-- Database: PostgreSQL

-- Enums for state control
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE job_state AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'paid');
CREATE TYPE service_category AS ENUM ('driver', 'maid', 'cook', 'delivery', 'helper');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_type VARCHAR(20) NOT NULL, -- 'google' or 'phone'
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    location_city_town TEXT NOT NULL, -- Open text input as requested
    gender_self_typed TEXT NOT NULL,  -- Open text input string as requested
    user_type user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Service Providers Table
CREATE TABLE service_providers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    profile_photo_url TEXT,
    is_on_duty BOOLEAN DEFAULT false,
    verification_status verification_status DEFAULT 'pending',
    service_type service_category NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.0
);

-- 3. Verification Documents Table
CREATE TABLE verification_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'Aadhaar', 'License', 'PAN'
    document_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    audited_by UUID REFERENCES users(id),
    audit_notes TEXT
);

-- 4. Jobs Table (The Marketplace Engine)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES service_providers(id),
    service_category service_category NOT NULL,
    description TEXT,
    booking_duration_type VARCHAR(20), -- 'short', 'daily', 'weekly'
    location_details TEXT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    job_state job_state DEFAULT 'requested',
    escrow_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_provider_duty ON service_providers(is_on_duty, verification_status);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_state ON jobs(job_state);
