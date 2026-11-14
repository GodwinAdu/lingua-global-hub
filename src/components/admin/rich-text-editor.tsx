'use client';

import { useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Underline,
  Undo2,
  Unlink,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { IMAGE_TYPES, uploadImage } from '@/lib/content/upload';
import { cn } from '@/lib/utils';

/**
 * WYSIWYG editor for article bodies. Outputs HTML; the server sanitizes it
 * on save, so this component is not a security boundary.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article…',
  imageFolder = 'posts',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  imageFolder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'article-body min-h-[400px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });

  return (
    <div className="rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring">
      {editor ? <Toolbar editor={editor} imageFolder={imageFolder} /> : <div className="h-11 border-b" />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, imageFolder }: { editor: Editor; imageFolder: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }

  async function onImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const src = await uploadImage(file, imageFolder);
      const alt = window.prompt('Describe the image (for screen readers and Google)', '') ?? '';
      editor.chain().focus().setImage({ src, alt }).run();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const c = () => editor.chain().focus();

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background/95 p-1.5 backdrop-blur">
      <Btn icon={Bold} label="Bold" active={state.bold} onClick={() => c().toggleBold().run()} />
      <Btn icon={Italic} label="Italic" active={state.italic} onClick={() => c().toggleItalic().run()} />
      <Btn icon={Underline} label="Underline" active={state.underline} onClick={() => c().toggleUnderline().run()} />
      <Sep />
      <Btn icon={Heading2} label="Heading" active={state.h2} onClick={() => c().toggleHeading({ level: 2 }).run()} />
      <Btn icon={Heading3} label="Subheading" active={state.h3} onClick={() => c().toggleHeading({ level: 3 }).run()} />
      <Btn icon={List} label="Bulleted list" active={state.bullet} onClick={() => c().toggleBulletList().run()} />
      <Btn icon={ListOrdered} label="Numbered list" active={state.ordered} onClick={() => c().toggleOrderedList().run()} />
      <Btn icon={Quote} label="Quote" active={state.quote} onClick={() => c().toggleBlockquote().run()} />
      <Btn icon={Minus} label="Divider" onClick={() => c().setHorizontalRule().run()} />
      <Sep />
      <Btn icon={Link2} label="Link" active={state.link} onClick={setLink} />
      {state.link && <Btn icon={Unlink} label="Remove link" onClick={() => c().unsetLink().run()} />}
      <Btn
        icon={uploading ? Loader2 : ImagePlus}
        label="Insert image"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        spin={uploading}
      />
      <Sep />
      <Btn icon={Undo2} label="Undo" onClick={() => c().undo().run()} disabled={!state.canUndo} />
      <Btn icon={Redo2} label="Redo" onClick={() => c().redo().run()} disabled={!state.canRedo} />
      <input
        ref={fileRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => onImage(e.target.files?.[0])}
      />
    </div>
  );
}

function Btn({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
  spin,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  spin?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // Keep focus and the text selection in the editor when a toolbar button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40',
        active && 'bg-muted text-foreground',
      )}
    >
      <Icon className={cn('h-4 w-4', spin && 'animate-spin')} />
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}
