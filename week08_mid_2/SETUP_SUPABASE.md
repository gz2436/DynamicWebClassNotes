# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `resumeai`
   - Database password: (generate a strong password)
   - Region: Choose closest to you
5. Wait for project to be created (~2 minutes)

## Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy the following values to your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ Keep this secret!)

## Step 3: Create Database Tables

1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Paste the following SQL and run it:

```sql
-- Create resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX resumes_user_id_idx ON resumes(user_id);
CREATE INDEX resumes_updated_at_idx ON resumes(updated_at DESC);
```

## Step 4: Configure Authentication

1. Go to Authentication → Providers
2. Enable the following providers:
   - ✅ Email (already enabled by default)
   - ✅ Google OAuth (optional, but recommended)
   - ✅ GitHub OAuth (optional, but recommended)

### For Google OAuth:
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### For GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## Step 5: Configure Email Templates (Optional)

1. Go to Authentication → Email Templates
2. Customize the templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

## Step 6: Test Connection

After filling in your `.env.local` file, restart the dev server:

```bash
npm run dev
```

The app should now connect to Supabase successfully!
