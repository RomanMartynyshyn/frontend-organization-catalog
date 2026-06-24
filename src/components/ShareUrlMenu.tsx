'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';
import {
  buildFacebookShareUrl,
  buildTelegramShareUrl,
  buildViberShareUrl,
  buildWhatsAppShareUrl,
  copyTextToClipboard,
} from '@/lib/share/shareUrls';

type ShareUrlMenuProps = {
  title?: string;
  url?: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
};

type ShareMenuItem = {
  id: string;
  label: string;
  iconSrc: string;
  action: 'link' | 'copy';
  href?: string;
};

function buildCurrentUrl(pathname: string, search: string): string {
  if (typeof window === 'undefined') {
    return pathname;
  }

  return `${window.location.origin}${pathname}${search ? `?${search}` : ''}`;
}

export function ShareUrlMenu({
  title,
  url,
  children,
  className,
  'aria-label': ariaLabel = 'Поділитися',
}: ShareUrlMenuProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  const search = searchParams.toString();
  const shareUrl = url ?? buildCurrentUrl(pathname, search);
  const shareTitle = title?.trim() ?? '';

  const menuItems: ShareMenuItem[] = [
    {
      id: 'copy',
      label: 'Скопіювати посилання',
      iconSrc: '/assets/icons/copy.svg',
      action: 'copy',
    },
    {
      id: 'viber',
      label: 'Viber',
      iconSrc: '/assets/icons/viber.svg',
      action: 'link',
      href: buildViberShareUrl(shareUrl, shareTitle),
    },
    {
      id: 'telegram',
      label: 'Telegram',
      iconSrc: '/assets/icons/telegram.svg',
      action: 'link',
      href: buildTelegramShareUrl(shareUrl, shareTitle),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      iconSrc: '/assets/icons/facebook.svg',
      action: 'link',
      href: buildFacebookShareUrl(shareUrl),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      iconSrc: '/assets/icons/whatsapp.svg',
      action: 'link',
      href: buildWhatsAppShareUrl(shareUrl, shareTitle),
    },
  ];

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (!copiedItemId) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopiedItemId(null);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copiedItemId]);

  const handleCopy = useCallback(
    async (itemId: string) => {
      const copied = await copyTextToClipboard(shareUrl);

      if (!copied) {
        return;
      }

      setCopiedItemId(itemId);

      window.setTimeout(() => {
        setCopiedItemId(null);
        closeMenu();
      }, 1500);
    },
    [closeMenu, shareUrl],
  );

  const handleItemClick = (item: ShareMenuItem) => {
    if (item.action === 'copy') {
      void handleCopy(item.id);
      return;
    }

    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }

    closeMenu();
  };

  return (
    <div ref={containerRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        className="cursor-pointer opacity-80 transition hover:opacity-100"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        {children}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Поділитися в соцмережах"
          className="absolute top-full right-0 z-30 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-black bg-white py-1 shadow-lg"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-black transition hover:bg-[#f2f2f2]"
              onClick={() => {
                handleItemClick(item);
              }}
            >
              <Image
                src={item.iconSrc}
                alt=""
                width={item.id === 'viber' ? 28 : 24}
                height={item.id === 'viber' ? 28 : 24}
                className="shrink-0"
                aria-hidden
              />
              <span className="font-eUkraine leading-snug">
                {copiedItemId === item.id ? 'Скопійовано' : item.label}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
