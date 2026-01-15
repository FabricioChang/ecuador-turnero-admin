-- Create storage bucket for advertising content (images and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'publicidad', 
  'publicidad', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
);

-- Policy: Everyone can view advertising content (public bucket)
CREATE POLICY "Public can view publicidad files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'publicidad');

-- Policy: Authenticated admins can upload advertising content
CREATE POLICY "Admins can upload publicidad files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'publicidad' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Authenticated admins can update advertising content
CREATE POLICY "Admins can update publicidad files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'publicidad' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Authenticated admins can delete advertising content
CREATE POLICY "Admins can delete publicidad files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'publicidad' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);