import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables but for this demo
// we'll use dummy values as we're just modifying the UI
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to upload an image to Supabase storage
export async function uploadImage(file: any, bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Function to get a public URL for an image
export function getImageUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
} 