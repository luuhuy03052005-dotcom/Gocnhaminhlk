import type { CarouselHighlightItem, GalleryItem, MenuCategory } from '../config/siteData';

interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiErrorBody;
}

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/+$/, '') : '';
const hasApiVersionPrefix = /\/api\/v1$/i.test(apiBaseUrl);

export const isPublicApiConfigured = Boolean(apiBaseUrl && hasApiVersionPrefix);

async function requestPublic<T>(path: string, signal: AbortSignal): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('API_NOT_CONFIGURED');
  }

  if (!hasApiVersionPrefix) {
    throw new Error('API_BASE_URL_MUST_INCLUDE_API_V1');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new Error(body.error?.message || 'REQUEST_FAILED');
  }

  return body.data;
}

export const publicApi = {
  getMenu: (signal: AbortSignal) => requestPublic<unknown>('/public/menu', signal),
  getBanners: (signal: AbortSignal) => requestPublic<unknown>('/public/banners', signal),
  getGallery: (signal: AbortSignal) => requestPublic<unknown>('/public/gallery', signal),
  getVouchers: (signal: AbortSignal) => requestPublic<unknown>('/public/vouchers', signal),
  getWebsiteContent: (signal: AbortSignal) => requestPublic<unknown>('/public/website-content', signal),
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

export const isMenuCategories = (value: unknown): value is MenuCategory[] => (
  Array.isArray(value)
  && value.every((category) => (
    isRecord(category)
    && typeof category.id === 'string'
    && typeof category.name === 'string'
    && Array.isArray(category.items)
    && category.items.every((item) => (
      isRecord(item)
      && typeof item.name === 'string'
      && typeof item.price === 'string'
      && (item.desc === undefined || typeof item.desc === 'string')
      && (item.isBestSeller === undefined || typeof item.isBestSeller === 'boolean')
    ))
  ))
);

export const isGalleryItems = (value: unknown): value is GalleryItem[] => (
  Array.isArray(value)
  && value.every((item) => (
    isRecord(item)
    && typeof item.id === 'string'
    && typeof item.title === 'string'
    && typeof item.image === 'string'
    && typeof item.alt === 'string'
    && (item.subtitle === undefined || typeof item.subtitle === 'string')
    && (item.description === undefined || typeof item.description === 'string')
    && (item.badge === undefined || typeof item.badge === 'string')
    && (item.ctaLabel === undefined || typeof item.ctaLabel === 'string')
    && (item.ctaLink === undefined || typeof item.ctaLink === 'string')
    && (item.objectPosition === undefined || typeof item.objectPosition === 'string')
  ))
);

export const isHighlightItems = (value: unknown): value is CarouselHighlightItem[] => (
  Array.isArray(value)
  && value.every((item) => (
    isRecord(item)
    && (item.type === 'promo' || item.type === 'menu')
    && typeof item.id === 'string'
    && typeof item.title === 'string'
    && typeof item.image === 'string'
    && typeof item.alt === 'string'
    && (item.subtitle === undefined || typeof item.subtitle === 'string')
    && (item.description === undefined || typeof item.description === 'string')
    && (item.ctaLabel === undefined || typeof item.ctaLabel === 'string')
    && (item.ctaLink === undefined || typeof item.ctaLink === 'string')
    && (item.badge === undefined || typeof item.badge === 'string')
    && (item.type === 'promo' || typeof item.price === 'string')
  ))
);
