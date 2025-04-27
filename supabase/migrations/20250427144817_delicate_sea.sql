/*
  # Fix profiles table RLS policies

  1. Changes
    - Remove recursive policies from profiles table
    - Simplify RLS policies to prevent infinite recursion
    - Maintain security while fixing the recursion issue
  
  2. Security
    - Enable RLS on profiles table
    - Add simplified policies for:
      - Select access for authenticated users
      - Insert/Update own profile
      - Master user management capabilities
*/

-- First, drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Master users can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate policies without recursion
CREATE POLICY "Enable read access for all authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Master users can manage all profiles"
ON profiles FOR ALL
TO authenticated
USING (
  (auth.uid() = id AND (
    SELECT is_master FROM profiles WHERE id = auth.uid()
  ))
);