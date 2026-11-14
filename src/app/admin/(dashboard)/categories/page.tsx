import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { CategoryRow, NewCategoryForm } from './category-forms';

export const metadata: Metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  await requireStaff('editor');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, label, label_twi, sort_order, posts(count)')
    .order('sort_order')
    .order('label');

  const categories = (data ?? []).map((c) => ({
    ...c,
    posts: (c.posts as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Group posts on the blog page. Lower order numbers show first.</p>
      </div>

      {error && <p className="text-destructive">Could not load categories: {error.message}</p>}

      <div className="rounded-xl border">
        <div className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span>Twi name</span>
          <span>Order</span>
          <span className="w-[100px]" />
        </div>
        {categories.map((category) => (
          <CategoryRow key={`${category.id}-${category.label}-${category.sort_order}`} category={category} />
        ))}
        <div className="border-t bg-muted/20">
          <NewCategoryForm />
        </div>
      </div>
    </div>
  );
}
