import { useEffect, useMemo, useState } from 'react';
import { featureFlags } from '../config/featureFlags';
import { siteData } from '../config/siteData';
import type { CarouselHighlightItem, GalleryItem, MenuCategory } from '../config/siteData';
import {
  isGalleryItems,
  isHighlightItems,
  isMenuCategories,
  isPublicApiConfigured,
  publicApi,
} from '../services/publicApi';

type PublicContentStatus = 'static' | 'loading' | 'ready' | 'fallback';

interface RemotePublicContent {
  menuCategories?: MenuCategory[];
  galleryItems?: GalleryItem[];
  highlightItems?: CarouselHighlightItem[];
}

export function usePublicContent() {
  const [remoteContent, setRemoteContent] = useState<RemotePublicContent>({});
  const [status, setStatus] = useState<PublicContentStatus>(
    isPublicApiConfigured ? 'loading' : 'static',
  );
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  useEffect(() => {
    if (!isPublicApiConfigured) {
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const coldStartTimer = window.setTimeout(() => {
      if (isActive) {
        setShowColdStartMessage(true);
      }
    }, 1200);

    async function loadPublicContent() {
      const results = await Promise.allSettled([
        featureFlags.DYNAMIC_MENU ? publicApi.getMenu(controller.signal) : Promise.resolve([]),
        featureFlags.DYNAMIC_BANNER ? publicApi.getBanners(controller.signal) : Promise.resolve([]),
        publicApi.getGallery(controller.signal),
        publicApi.getVouchers(controller.signal),
        publicApi.getWebsiteContent(controller.signal),
      ]);

      if (!isActive) return;

      const nextContent: RemotePublicContent = {};
      const menuResult = results[0];
      const bannersResult = results[1];
      const galleryResult = results[2];
      const hasRejectedRequest = results.some((result) => result.status === 'rejected');

      if (menuResult.status === 'fulfilled' && isMenuCategories(menuResult.value) && menuResult.value.length > 0) {
        nextContent.menuCategories = menuResult.value;
      }

      if (bannersResult.status === 'fulfilled' && isHighlightItems(bannersResult.value) && bannersResult.value.length > 0) {
        nextContent.highlightItems = bannersResult.value;
      }

      if (galleryResult.status === 'fulfilled' && isGalleryItems(galleryResult.value) && galleryResult.value.length > 0) {
        nextContent.galleryItems = galleryResult.value;
      }

      setRemoteContent(nextContent);
      setStatus(hasRejectedRequest ? 'fallback' : 'ready');
      setShowColdStartMessage(false);
    }

    loadPublicContent().catch(() => {
      if (!isActive) return;
      setStatus('fallback');
      setShowColdStartMessage(false);
    });

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(coldStartTimer);
    };
  }, []);

  const content = useMemo(() => ({
    menuCategories: remoteContent.menuCategories ?? siteData.menu.categories,
    galleryItems: remoteContent.galleryItems ?? siteData.images.gallery,
    highlightItems: remoteContent.highlightItems ?? siteData.highlights,
  }), [remoteContent.galleryItems, remoteContent.highlightItems, remoteContent.menuCategories]);

  const notice = useMemo(() => {
    if (showColdStartMessage) {
      return 'Hệ thống đang khởi động, vui lòng đợi trong giây lát...';
    }

    if (status === 'fallback') {
      return 'Đang hiển thị dữ liệu tạm thời. Một số nội dung mới có thể chưa được cập nhật.';
    }

    return null;
  }, [showColdStartMessage, status]);

  return {
    ...content,
    notice,
    status,
  };
}
