/**
 * Web Haptic Feedback Utilities
 * iOS-inspired haptic feedback using Web Vibration API
 */

export const HapticFeedback = {
  /**
   * Light impact - For subtle interactions
   * e.g., button taps, selections
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium impact - For important interactions
   * e.g., drag start, important taps
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy impact - For critical interactions
   * e.g., significant actions, warnings
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Success notification
   * e.g., task completion, successful save
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Warning notification
   * e.g., delete confirmation, important notice
   */
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([15, 30, 15, 30, 15]);
    }
  },

  /**
   * Error notification
   * e.g., failed operations, validation errors
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  /**
   * Selection feedback
   * e.g., list item selection, radio button
   */
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },

  /**
   * Check if device supports vibration
   */
  isSupported: () => {
    return 'vibrate' in navigator;
  },
};

/**
 * Usage examples:
 *
 * // Button click
 * onClick={() => {
 *   HapticFeedback.light();
 *   handleClick();
 * }}
 *
 * // Task completed
 * onTaskComplete={() => {
 *   HapticFeedback.success();
 *   showSuccessMessage();
 * }}
 *
 * // Delete action
 * onDelete={() => {
 *   HapticFeedback.warning();
 *   confirmDelete();
 * }}
 */
