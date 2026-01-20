import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InteractiveMap = () => {
  const location = {
    lat: 5.7507,
    lng: -0.0977,
    address: 'HNO. BE 37, Dandellon Street, Danfa, Accra',
    digitalAddress: 'GM-244-5169'
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border h-[400px] group">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(217_91%_50%_/_0.1)_0%,_transparent_50%)]" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(217 91% 50% / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(217 91% 50% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Pulsing Location Marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Pulse Rings */}
          <motion.div
            animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 -m-8 rounded-full bg-secondary"
          />
          <motion.div
            animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 -m-8 rounded-full bg-accent"
          />
          
          {/* Main Marker */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-2xl shadow-secondary/50 flex items-center justify-center border-4 border-background">
              <MapPin className="w-8 h-8 text-white fill-white" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-xl rounded-xl p-4 shadow-premium-lg border border-border"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Our Location
              </span>
            </div>
            <h4 className="font-semibold text-foreground mb-1">
              {location.address}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              Digital Address: {location.digitalAddress}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              asChild
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
                View
              </a>
            </Button>
            <Button
              size="sm"
              variant="premium"
              className="h-8 px-3"
              asChild
            >
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-3 h-3" />
                Directions
              </a>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-2xl" />
      <div className="absolute bottom-20 left-4 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-3xl" />
    </div>
  );
};

export default InteractiveMap;
