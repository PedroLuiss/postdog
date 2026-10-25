import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AnimatedListUiProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemId: (item: T) => string | number;
  itemClassName?: string;
  animationType?: 'fade-up' | 'scale' | 'fade';
  customVariants?: Variants;
}

export const AnimatedListUi = <T,>({
  items,
  renderItem,
  getItemId,
  itemClassName,
  animationType = 'fade-up',
  customVariants
}: AnimatedListUiProps<T>) => {

  const defaultVariants: Record<string, Variants> = {
    'fade-up': {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    },
    'scale': {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    },
    'fade': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    }
  };

  const selectedVariant = customVariants || defaultVariants[animationType];

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {items.map((item, index) => (
        <motion.div
          key={getItemId(item)}
          layout
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariant}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
