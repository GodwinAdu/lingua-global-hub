'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { IMAGE_TYPES, uploadImage } from '@/lib/content/upload';
import { cn } from '@/lib/utils';

/** Single image picker with upload and preview. */
export function ImageField({
  value,
  onChange,
  folder,
  label = 'Upload image',
  className,
  aspect = 'aspect-video',
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  className?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className={cn('relative overflow-hidden rounded-lg border bg-muted', aspect)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange('')}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted/50',
            aspect,
          )}
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          {uploading ? 'Uploading…' : label}
        </button>
      )}
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />} Replace
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

/** Multiple images, e.g. an article gallery. */
export function GalleryField({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push(await uploadImage(file, folder));
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : 'upload failed'}`);
      }
    }
    onChange([...value, ...added]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {value.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 rounded bg-background/90 p-0.5"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50"
          aria-label="Add images"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}
