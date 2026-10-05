export interface AppRuntimeEnv {
  apiBaseUrl: string | null;
  useMockData: boolean;
  contentRequestTimeoutMs: number;
}

export interface AppEnvSource {
  VITE_API_BASE_URL?: string;
  VITE_USE_MOCK_DATA?: string;
  VITE_CONTENT_REQUEST_TIMEOUT_MS?: string;
}

const DEFAULT_CONTENT_REQUEST_TIMEOUT_MS = 6000;

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value for VITE_USE_MOCK_DATA: "${value}"`);
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid number value for VITE_CONTENT_REQUEST_TIMEOUT_MS: "${value}"`);
  }

  return parsed;
}

function normalizeBaseUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).toString().replace(/\/+$/, '');
  } catch {
    throw new Error(`Invalid URL value for VITE_API_BASE_URL: "${value}"`);
  }
}

export function readAppEnv(source: AppEnvSource = import.meta.env): AppRuntimeEnv {
  const useMockData = parseBoolean(source.VITE_USE_MOCK_DATA, true);
  const apiBaseUrl = normalizeBaseUrl(source.VITE_API_BASE_URL);
  const contentRequestTimeoutMs = parsePositiveInteger(
    source.VITE_CONTENT_REQUEST_TIMEOUT_MS,
    DEFAULT_CONTENT_REQUEST_TIMEOUT_MS,
  );

  if (!useMockData && !apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required when VITE_USE_MOCK_DATA is false.');
  }

  return {
    apiBaseUrl,
    useMockData,
    contentRequestTimeoutMs,
  };
}

export function getAppEnv(): AppRuntimeEnv {
  return readAppEnv();
}
