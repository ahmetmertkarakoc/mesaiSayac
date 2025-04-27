/*
  # Create initial schema for Mesai Sayaç application

  1. New Tables
    - `profiles` - Stores user profile information
      - `id` (uuid, primary key) - User ID from auth.users
      - `created_at` (timestamptz) - When the profile was created
      - `email` (text) - User's email address
      - `full_name` (text) - User's full name
      - `is_master` (boolean) - Whether the user has master/admin privileges
    
    - `work_hours` - Stores work hour records
      - `id` (uuid, primary key) - Unique ID for the record
      - `created_at` (timestamptz) - When the record was created
      - `user_id` (uuid) - Foreign key to profiles.id
      - `date` (date) - Date of the work
      - `hours` (numeric) - Number of hours worked
      - `description` (text) - Optional description of the work

  2. Security
    - Enable RLS on both tables
    - Add policies for user access:
      - Users can read and manage their own profiles
      - Master users can read and manage all profiles
      - Users can read and manage their own work hours
      - Master users can read and manage all work hours
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_master BOOLEAN DEFAULT FALSE
);

-- Create work_hours table
CREATE TABLE IF NOT EXISTS work_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  hours NUMERIC(5,2) NOT NULL CHECK (hours > 0),
  description TEXT
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_hours ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Master users can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Master users can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

CREATE POLICY "Master users can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

-- Work hours policies
CREATE POLICY "Users can view their own work hours"
  ON work_hours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Master users can view all work hours"
  ON work_hours FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

CREATE POLICY "Users can insert their own work hours"
  ON work_hours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work hours"
  ON work_hours FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Master users can update all work hours"
  ON work_hours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

CREATE POLICY "Users can delete their own work hours"
  ON work_hours FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Master users can delete all work hours"
  ON work_hours FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_master = TRUE
    )
  );

-- Create function to set default master user
CREATE OR REPLACE FUNCTION set_first_user_as_master()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_master = TRUE) THEN
    NEW.is_master = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set first user as master
CREATE TRIGGER set_first_user_as_master_trigger
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_first_user_as_master();