/**
 * iOS-inspired Animation System for Web
 * Smooth, spring-based animations
 */

export const AnimationPresets = {
  // iOS-style spring animation
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },

  // Quick fade transitions
  fade: {
    duration: 200,
    easing: 'ease-out',
  },

  // Slide in from bottom (iOS modal style)
  slideUp: {
    duration: 300,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },

  // Scale and fade (iOS alert style)
  scaleIn: {
    duration: 250,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bounce effect
  },

  // Smooth swipe (iOS gesture)
  swipe: {
    duration: 350,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
};

/**
 * CSS Animation Classes
 * Usage: <div className={animateIn.fadeIn}>Content</div>
 */
export const animateIn = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    animation: fadeIn 200ms ease-out;
  `,

  slideUp: `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    animation: slideUp 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
  `,

  slideDown: `
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    animation: slideDown 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
  `,

  slideLeft: `
    @keyframes slideLeft {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    animation: slideLeft 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
  `,

  slideRight: `
    @keyframes slideRight {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    animation: slideRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
  `,

  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    animation: scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  `,

  bounceIn: `
    @keyframes bounceIn {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    animation: bounceIn 400ms ease-out;
  `,
};

/**
 * Transition styles for hover/active states
 * iOS-style interactive feedback
 */
export const transitions = {
  // Standard button press
  buttonPress: {
    transition: 'transform 150ms ease-out',
    ':active': {
      transform: 'scale(0.95)',
    },
  },

  // Card hover effect
  cardHover: {
    transition: 'all 200ms ease-out',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    },
  },

  // Smooth color transition
  colorTransition: {
    transition: 'background-color 200ms ease-out, color 200ms ease-out',
  },

  // Scale on hover (iOS icon style)
  scaleHover: {
    transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    ':hover': {
      transform: 'scale(1.05)',
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
};

/**
 * Loading animations
 */
export const loadingAnimations = {
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    animation: spin 1s linear infinite;
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    animation: pulse 2s ease-in-out infinite;
  `,

  dots: `
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
  `,
};

/**
 * Success/Error animations
 */
export const feedbackAnimations = {
  checkmark: `
    @keyframes checkmark {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    animation: checkmark 400ms ease-out;
  `,

  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    animation: shake 400ms ease-out;
  `,

  celebrate: `
    @keyframes celebrate {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 1;
      }
      100% {
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
    animation: celebrate 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  `,
};

/**
 * Utility function to create custom spring animation
 */
export function createSpringAnimation(
  from: string,
  to: string,
  duration: number = 300
): string {
  return `
    @keyframes customSpring {
      from { ${from} }
      to { ${to} }
    }
    animation: customSpring ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1);
  `;
}

/**
 * Example Usage:
 *
 * // In a component
 * import { animateIn, transitions } from '@/lib/utils/animations';
 *
 * <div
 *   style={{
 *     animation: 'fadeIn 200ms ease-out',
 *     ...transitions.cardHover
 *   }}
 * >
 *   Content
 * </div>
 *
 * // With Framer Motion
 * <motion.div
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={AnimationPresets.spring}
 * >
 *   Content
 * </motion.div>
 */
