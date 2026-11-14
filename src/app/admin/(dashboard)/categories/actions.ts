'use server';

import { refresh, updateTag } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/content/html';
import { CATEGORIES_TAG, POSTS_TAG } from '@/lib/content/posts';

export type CategoryState = { error?: string; success?: string } | undefined;

export async function saveCategory(_prev: CategoryState, formData: FormData): Promise<CategoryState> {
  await requireStaff('editor');

  const id = String(formData.get('id') ?? '');
  const label = String(formData.get('label') ?? '').trim().slice(0, 60);
  const labelTwi = String(formData.get('label_twi') ?? '').trim().slice(0, 60);
  const sortOrder = Number.parseInt(String(formData.get('sort_order') ?? '0'), 10);
  if (!label) return { error: 'Add a name.' };

  const row = { label, label_twi: labelTwi || null, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 };
  const supabase = await createClient();
  const { error } = /^\d+$/.test(id)
    ? await supabase.from('categories').update(row).eq('id', Number(id))
    : await supabase.from('categories').insert({ ...row, slug: slugify(label) });

  if (error) {
    if (error.code === '23505') return { error: 'A category with that name already exists.' };
    return { error: 'Could not save the category.' };
  }

  updateTag(CATEGORIES_TAG);
  refresh();
  return { success: 'Category saved.' };
}

export async function deleteCategory(id: number): Promise<CategoryState> {
  await requireStaff('editor');
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: 'Could not delete the category.' };

  // Posts in this category become uncategorised.
  updateTag(CATEGORIES_TAG);
  updateTag(POSTS_TAG);
  refresh();
  return { success: 'Category deleted.' };
}
