-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage custom roles" ON custom_roles;

-- Create separate policies for different operations
CREATE POLICY "Admins can insert custom roles" 
ON custom_roles 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update custom roles" 
ON custom_roles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete custom roles" 
ON custom_roles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));