import { motion } from 'framer-motion';

const languages = [
  'English', 'French', 'Spanish', 'Arabic', 'Swahili', 'Portuguese',
  'Mandarin', 'German', 'Italian', 'Russian', 'Japanese', 'Korean',
  'Hindi', 'Yoruba', 'Igbo', 'Hausa', 'Amharic', 'Zulu'
];

export const LanguageMarquee = () => {
  return (
    <section className="py-12 bg-muted/30 overflow-hidden border-y border-border/50">
      <div className="mb-6 text-center">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          We Speak Your Language
        </span>
      </div>
      
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        {/* Scrolling content */}
        <div className="flex">
          <motion.div
            className="flex gap-8 pr-8"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...languages, ...languages].map((language, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-medium text-foreground">{language}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            className="flex gap-8 pr-8"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...languages, ...languages].map((language, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-medium text-foreground">{language}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LanguageMarquee;
