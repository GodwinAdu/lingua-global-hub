'use client';

import { createClient } from '@/lib/supabase/client';

export const MEDIA_BUCKET = 'media';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // matches the bucket limit
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/**
 * Uploads an image to the public media bucket as the signed-in user (storage
 * RLS requires a staff role) and returns its public URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use a JPG, PNG, WebP, GIF or AVIF image.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 10 MB or smaller.');

  const now = new Date();
  const path = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
