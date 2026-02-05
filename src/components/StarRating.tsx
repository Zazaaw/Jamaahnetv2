import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showCount?: boolean;
  count?: number;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  size = 'md',
  readonly = false,
  showCount = false,
  count = 0,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          type="button"
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              value <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-gray-300 dark:text-gray-600'
            } transition-colors`}
          />
        </motion.button>
      ))}
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
