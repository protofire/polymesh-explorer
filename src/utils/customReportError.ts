import { IS_DEVELOPMENT } from '@/config/environment';

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

/**
 * Processes and reports an error.
 * This function could be used with an error reporting service such as Sentry.
 */
export function customReportError(error: unknown): string {
  const errorMessage = getErrorMessage(error);

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.error(error);

  // Logic to report the error to a service

  return errorMessage;
}
