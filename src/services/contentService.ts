import { getAppEnv, type AppRuntimeEnv } from '../config/appEnv';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface ContentServiceOptions {
  readEnv?: () => AppRuntimeEnv;
  fetchImpl?: FetchLike;
  delayImpl?: (ms: number) => Promise<void>;
  randomDelayRange?: {
    min: number;
    max: number;
  };
}

interface ContentEndpoint<T> {
  endpoint: string;
  fallback: T[];
  resourceName: string;
}

const DEFAULT_DELAY_RANGE = {
  min: 180,
  max: 420,
};

const defaultFetchImpl =
  typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined;

// ── Types matching the current Prisma schema ──

export interface PracticeArea {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  iconUrl: string | null;
  imageUrl: string | null;
  shortDesc: string | null;
  body: string | null;
  isActive: boolean;
  sortOrder: number;
  children?: PracticeArea[];
}

export interface TeamMember {
  id: string;
  fullName: string;
  roleTitle: string;
  photoUrl: string | null;
  bio: string | null;
  email: string | null;
  linkedinUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  practiceAreaId: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface NewsArticle {
  id: string;
  categoryId: string | null;
  authorId: string | null;
  title: string;
  slug: string;
  featuredImage: string | null;
  excerpt: string | null;
  body: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  category?: NewsCategory | null;
  author?: { id: string; fullName: string } | null;
}

export interface ClientLogo {
  id: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  category: string | null;
  downloadCount: number;
}

export interface MatterType {
  id: string;
  name: string;
  practiceAreaId: string | null;
}

function cloneCollection<T>(items: readonly T[]): T[] {
  return items.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return { ...(item as object) } as T;
    }

    return item;
  });
}

function simulateNetworkDelay(
  delayImpl: ((ms: number) => Promise<void>) | undefined,
  randomDelayRange: { min: number; max: number },
) {
  const delay =
    Math.floor(Math.random() * (randomDelayRange.max - randomDelayRange.min + 1)) +
    randomDelayRange.min;

  if (delayImpl) {
    return delayImpl(delay);
  }

  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });
}

export async function postJson<T>(endpoint: string, body: unknown, readEnv: () => AppRuntimeEnv = getAppEnv): Promise<T> {
  const env = readEnv();
  if (!env.apiBaseUrl) {
    throw new Error('API is not configured.');
  }
  const url = new URL(endpoint, `${env.apiBaseUrl}/`).toString();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchJson<T>(
  fetchImpl: FetchLike,
  url: string,
  timeoutMs: number,
  resourceName: string,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load ${resourceName}. Received ${response.status} ${response.statusText}.`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request for ${resourceName} timed out after ${timeoutMs}ms.`);
    }

    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

async function resolveCollection<T>(
  source: ContentEndpoint<T>,
  options: Required<Pick<ContentServiceOptions, 'readEnv' | 'randomDelayRange'>> & {
    fetchImpl?: FetchLike;
    delayImpl?: (ms: number) => Promise<void>;
  },
): Promise<T[]> {
  const env = options.readEnv();

  if (env.useMockData || !env.apiBaseUrl) {
    await simulateNetworkDelay(options.delayImpl, options.randomDelayRange);
    return cloneCollection(source.fallback);
  }

  if (!options.fetchImpl) {
    throw new Error(`Fetch API is unavailable while loading ${source.resourceName}.`);
  }

  const endpointUrl = new URL(source.endpoint, `${env.apiBaseUrl}/`).toString();
  const payload = await fetchJson<unknown>(options.fetchImpl, endpointUrl, env.contentRequestTimeoutMs, source.resourceName);

  if (!Array.isArray(payload)) {
    throw new Error(`Unexpected ${source.resourceName} payload. Expected an array.`);
  }

  return cloneCollection(payload as T[]);
}

export function createContentService(options: ContentServiceOptions = {}) {
  const readEnv = options.readEnv ?? getAppEnv;
  const fetchImpl = options.fetchImpl ?? defaultFetchImpl;
  const randomDelayRange = options.randomDelayRange ?? DEFAULT_DELAY_RANGE;

  return {
    getPracticeAreas: async (): Promise<PracticeArea[]> =>
      resolveCollection(
        {
          endpoint: '/api/practice-areas',
          fallback: [],
          resourceName: 'practice areas',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    // Kept as "getAttorneys" for compatibility with existing callers —
    // now backed by the team-members endpoint.
    getAttorneys: async (): Promise<TeamMember[]> =>
      resolveCollection(
        {
          endpoint: '/api/team-members',
          fallback: [],
          resourceName: 'team members',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    // Kept as "getFAQItems" for compatibility — now backed by /api/faqs.
    getFAQItems: async (): Promise<Faq[]> =>
      resolveCollection(
        {
          endpoint: '/api/faqs',
          fallback: [],
          resourceName: 'FAQs',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    // Kept as "getBlogPosts" for compatibility — now backed by /api/news-articles.
    getBlogPosts: async (): Promise<NewsArticle[]> =>
      resolveCollection(
        {
          endpoint: '/api/news-articles',
          fallback: [],
          resourceName: 'news articles',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    // Kept as "getTestimonials" for compatibility — now backed by /api/client-logos.
    getTestimonials: async (): Promise<ClientLogo[]> =>
      resolveCollection(
        {
          endpoint: '/api/client-logos',
          fallback: [],
          resourceName: 'client logos',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    getNewsCategories: async (): Promise<NewsCategory[]> =>
      resolveCollection(
        {
          endpoint: '/api/news-categories',
          fallback: [],
          resourceName: 'news categories',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    getArticleBySlug: async (slug: string): Promise<NewsArticle> => {
      const env = readEnv();
      if (env.useMockData || !env.apiBaseUrl) {
        throw new Error('Article is not available in mock mode.');
      }
      if (!fetchImpl) {
        throw new Error('Fetch API is unavailable.');
      }
      const url = new URL(`/api/news-articles/${slug}`, `${env.apiBaseUrl}/`).toString();
      return fetchJson<NewsArticle>(fetchImpl, url, env.contentRequestTimeoutMs, 'news article');
    },

    getResources: async (): Promise<Resource[]> =>
      resolveCollection(
        {
          endpoint: '/api/resources',
          fallback: [],
          resourceName: 'resources',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),

    getMatterTypes: async (): Promise<MatterType[]> =>
      resolveCollection(
        {
          endpoint: '/api/matter-types',
          fallback: [],
          resourceName: 'matter types',
        },
        { readEnv, fetchImpl, delayImpl: options.delayImpl, randomDelayRange },
      ),
  };
}

export const contentService = createContentService();