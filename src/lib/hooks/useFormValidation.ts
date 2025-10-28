/**
 * useFormValidation Hook
 *
 * Provides form validation with real-time feedback and accessibility support.
 *
 * Usage:
 * const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } =
 *   useFormValidation({
 *     initialValues: { email: '', password: '' },
 *     validationRules: {
 *       email: [required(), email()],
 *       password: [required(), minLength(8)]
 *     },
 *     onSubmit: async (values) => { ... }
 *   });
 */

import { useState, useCallback } from 'react';
import { announceToScreenReader } from './useAccessibility';

export type ValidationRule<T = any> = (value: T, allValues?: any) => string | undefined;

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface FormValidationOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Built-in validation rules
 */
export const validators = {
  required: (message = 'This field is required'): ValidationRule => (value) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return undefined;
  },

  email: (message = 'Please enter a valid email address'): ValidationRule => (value) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value).toLowerCase()) ? undefined : message;
  },

  minLength: (min: number, message?: string): ValidationRule => (value) => {
    if (!value) return undefined;
    return String(value).length >= min
      ? undefined
      : message || `Must be at least ${min} characters`;
  },

  maxLength: (max: number, message?: string): ValidationRule => (value) => {
    if (!value) return undefined;
    return String(value).length <= max
      ? undefined
      : message || `Must be at most ${max} characters`;
  },

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => (value) => {
    if (!value) return undefined;
    return regex.test(String(value)) ? undefined : message;
  },

  min: (min: number, message?: string): ValidationRule => (value) => {
    if (value === undefined || value === null) return undefined;
    return Number(value) >= min
      ? undefined
      : message || `Must be at least ${min}`;
  },

  max: (max: number, message?: string): ValidationRule => (value) => {
    if (value === undefined || value === null) return undefined;
    return Number(value) <= max
      ? undefined
      : message || `Must be at most ${max}`;
  },

  url: (message = 'Please enter a valid URL'): ValidationRule => (value) => {
    if (!value) return undefined;
    try {
      new URL(String(value));
      return undefined;
    } catch {
      return message;
    }
  },

  matches: (fieldName: string, message?: string): ValidationRule => (value, allValues) => {
    if (!value) return undefined;
    return value === allValues?.[fieldName]
      ? undefined
      : message || `Must match ${fieldName}`;
  },

  custom: (validate: (value: any) => boolean, message: string): ValidationRule => (value) => {
    return validate(value) ? undefined : message;
  },
};

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: FormValidationOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any, allValues: T): string | undefined => {
      const rules = validationRules[name as string];
      if (!rules) return undefined;

      for (const rule of rules) {
        const error = rule(value, allValues);
        if (error) return error;
      }
      return undefined;
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      const errors: Partial<Record<keyof T, string>> = {};

      for (const name in validationRules) {
        const error = validateField(name as keyof T, values[name], values);
        if (error) {
          errors[name as keyof T] = error;
        }
      }

      return errors;
    },
    [validationRules, validateField]
  );

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const errors = validateOnChange
          ? { ...prev.errors, [name]: validateField(name, value, newValues) }
          : prev.errors;

        // Remove error if field is now valid
        if (!errors[name]) {
          delete errors[name];
        }

        const isValid = Object.keys(errors).length === 0;

        return {
          ...prev,
          values: newValues,
          errors,
          isValid,
        };
      });
    },
    [validateField, validateOnChange]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      if (!validateOnBlur) return;

      setState((prev) => {
        const error = validateField(name, prev.values[name], prev.values);
        const errors = { ...prev.errors };

        if (error) {
          errors[name] = error;
          // Announce error to screen readers
          announceToScreenReader(`${String(name)}: ${error}`, 'assertive');
        } else {
          delete errors[name];
        }

        return {
          ...prev,
          touched: { ...prev.touched, [name]: true },
          errors,
          isValid: Object.keys(errors).length === 0,
        };
      });
    },
    [validateField, validateOnBlur]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setState((prev) => ({ ...prev, isSubmitting: true }));

      // Validate all fields
      const errors = validateForm(state.values);
      const isValid = Object.keys(errors).length === 0;

      if (!isValid) {
        setState((prev) => ({
          ...prev,
          errors,
          isValid: false,
          isSubmitting: false,
          touched: Object.keys(validationRules).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          ),
        }));

        // Announce validation errors to screen readers
        const errorCount = Object.keys(errors).length;
        announceToScreenReader(
          `Form validation failed. ${errorCount} error${errorCount > 1 ? 's' : ''} found.`,
          'assertive'
        );

        return;
      }

      try {
        await onSubmit(state.values);
        announceToScreenReader('Form submitted successfully', 'polite');
      } catch (error) {
        console.error('Form submission error:', error);
        announceToScreenReader('Form submission failed. Please try again.', 'assertive');
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.values, validateForm, onSubmit, validationRules]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  // Set field error programmatically
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: false,
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
  };
}

/**
 * Helper to get field props for input components
 */
export function getFieldProps<T extends Record<string, any>>(
  name: keyof T,
  formState: ReturnType<typeof useFormValidation<T>>
) {
  return {
    name: String(name),
    value: formState.values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      formState.handleChange(name, e.target.value),
    onBlur: () => formState.handleBlur(name),
    error: formState.touched[name] ? formState.errors[name] : undefined,
    'aria-invalid': formState.touched[name] && !!formState.errors[name],
    'aria-describedby': formState.errors[name] ? `${String(name)}-error` : undefined,
  };
}
