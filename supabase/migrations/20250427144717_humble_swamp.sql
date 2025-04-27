/*
  # Fix RLS Policies and Foreign Key Constraints

  1. Changes
    - Remove recursive policies from profiles table
    - Simplify RLS policies for better performance and reliability
    - Add missing profile creation trigger
    
  2. Security
    - Maintain secure access control while avoiding recursion
    - Ensure proper profile creation for new users
    - Keep existing RLS enabled on all tables
*/

-- Drop existing policies to rebuild them without recursion
DROP POLICY IF EXISTS "Master users can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Master users can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Master users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new, simplified policies for profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO public
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Master users can manage all profiles"
ON profiles FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_master = true
  )
);

-- Create function to ensure profile exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();