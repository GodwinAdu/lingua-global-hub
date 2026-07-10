import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

const NewsTicker = () => {
  // Duplicate posts enough times to create seamless infinite scroll
  const tickerItems = [...blogPosts, ...blogPosts, ...blogPosts, ...blogPosts];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden relative z-[60]">
      <div className="flex items-center h-9">
        {/* Label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 bg-secondary text-secondary-foreground h-full z-10">
          <Newspaper className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">News</span>
        </div>

        {/* Scrolling Content */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {tickerItems.map((post, index) => (
              <Link
                key={`${post.id}-${index}`}
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-3 text-xs text-primary-foreground/90 hover:text-secondary transition-colors duration-200 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                <span className="font-medium group-hover:underline underline-offset-2">
                  {post.title}
                </span>
                <span className="text-primary-foreground/50">•</span>
                <span className="text-primary-foreground/60">{post.languageLabel}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
