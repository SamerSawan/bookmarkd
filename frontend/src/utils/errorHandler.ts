import { AxiosError } from 'axios';

interface ErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Type guard to check if error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError<ErrorResponse> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}
