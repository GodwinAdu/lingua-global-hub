'use client';

import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Globe,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  CheckCheck,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingChat from '@/components/sections/FloatingChat';
import { Button } from '@/components/ui/button';
import type { BlogCategory, BlogPost } from '@/lib/content/types';
import { CommentsSection, EngagementBar, PostEngagementProvider, ReadingProgress } from '@/components/blog/post-engagement';

type Props = { post: BlogPost; relatedPosts: BlogPost[]; categories: BlogCategory[] };

const BlogDetailPage = ({ post, relatedPosts, categories: blogCategories }: Props) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  // navigator.share only exists in the browser; checking after mount avoids a hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time feature detection
  useEffect(() => setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), []);

  const postUrl = absoluteUrl(`/blog/${post.slug}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(postUrl);
  const shareTitle = encodeURIComponent(post.title);


  return (
    <PostEngagementProvider slug={post.slug}>
    <div className="min-h-screen">
      <ReadingProgress />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />

          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Blog</span>
                </Link>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/20 text-secondary border border-secondary/30">
                  <Globe className="w-3 h-3 inline mr-1" />
                  {post.languageLabel}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30 capitalize">
                  {blogCategories.find((c) => c.id === post.category)?.label || post.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
              >
                {post.title}
              </motion.h1>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-primary-foreground/70"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{post.author.name}</p>
                    <p className="text-xs text-primary-foreground/60">{post.author.role}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} read
                </span>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Article Content */}
        <section className="py-12 bg-background">
          <div className="container-premium">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_280px] gap-12">
                {/* Main Content */}
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="prose prose-lg max-w-none"
                >
                  {/* Featured Image */}
                  <div className="rounded-2xl overflow-hidden mb-10 shadow-premium-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-auto object-cover aspect-[16/9]"
                    />
                  </div>

                  {/* Article Body: HTML sanitized on save (src/lib/content/html.ts) */}
                  <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

                  {/* Gallery */}
                  {post.images.slice(1).map((src, index) => (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="mt-10 rounded-2xl overflow-hidden shadow-premium-md"
                    >
                      <img
                        src={src}
                        alt={`${post.title} — image ${index + 2}`}
                        className="w-full h-auto object-contain bg-muted/30 max-h-[400px]"
                      />
                    </motion.div>
                  ))}

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {post.tags.length > 0 && post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <EngagementBar />

                  {/* Author Card */}
                  <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground">
                          {post.author.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>
                  </div>

                  <CommentsSection />
                </motion.article>

                {/* Sidebar */}
                <aside className="space-y-8">
                  {/* Share Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="sticky top-32 p-6 rounded-2xl bg-card border border-border"
                  >
                    <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Article
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#25D366]/10 text-[#128C4B] hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors text-sm font-medium"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors text-sm font-medium"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors text-sm font-medium"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
                      >
                        {copied ? (
                          <>
                            <CheckCheck className="w-4 h-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                    {canNativeShare && (
                      <button
                        type="button"
                        onClick={() => navigator.share({ title: post.title, text: post.excerpt, url: postUrl }).catch(() => {})}
                        className="mt-2 flex w-full items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        More sharing options
                      </button>
                    )}

                    {/* Article Info */}
                    <div className="mt-6 pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-medium text-foreground">{post.languageLabel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-foreground capitalize">
                          {blogCategories.find((c) => c.id === post.category)?.label || post.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Published</span>
                        <span className="font-medium text-foreground">
                          {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container-premium">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((related, index) => (
                  <motion.article
                    key={related.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${related.slug}`} className="block">
                      <div className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-premium-md transition-all duration-500">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={related.coverImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {related.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingChat />
    </div>
    </PostEngagementProvider>
  );
};

export default BlogDetailPage;
