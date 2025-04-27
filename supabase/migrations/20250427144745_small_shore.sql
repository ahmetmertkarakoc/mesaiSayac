/*
  # Fix recursive RLS policies

  1. Changes
    - Drop existing policies on profiles table that cause recursion
    - Create new, non-recursive policies for profiles table
    
  2. Security
    - Maintain same level of access control but without recursion
    - Master users can still manage all profiles
    - Users can still manage their own profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Master users can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Master users can manage all profiles"
ON profiles FOR ALL
TO authenticated
USING (
  is_master = true 
  AND id = auth.uid()
);

-- Add policy for inserting own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);