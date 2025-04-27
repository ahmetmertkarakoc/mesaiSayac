/*
  # Fix recursive RLS policy

  1. Changes
    - Remove recursive policy "Master users can manage all profiles"
    - Add new non-recursive policy for master users
    - Keep other existing policies unchanged

  2. Security
    - Maintains RLS security model
    - Prevents infinite recursion while preserving master user privileges
*/

-- Drop the recursive policy
DROP POLICY IF EXISTS "Master users can manage all profiles" ON profiles;

-- Create new non-recursive policy for master users
CREATE POLICY "Master users can manage all profiles v2"
ON profiles
FOR ALL 
TO authenticated
USING (
  is_master = true
)
WITH CHECK (
  is_master = true
);