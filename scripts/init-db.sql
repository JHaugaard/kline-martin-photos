-- Database initialization script for local development
-- This runs automatically when the PostgreSQL container starts

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create images table with vector columns
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    title TEXT,
    keywords TEXT[] DEFAULT '{}',
    image_embedding vector(512),
    text_embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create share_links table
CREATE TABLE IF NOT EXISTS share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID
);

-- Create profiles table for user roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create vector similarity indexes (IVFFlat)
-- These will be created after data is loaded for better performance
-- For now, create simple indexes
CREATE INDEX IF NOT EXISTS idx_images_keywords ON images USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON share_links (token);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for images updated_at
DROP TRIGGER IF EXISTS update_images_updated_at ON images;
CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully with pgvector extension';
END $$;
