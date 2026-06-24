export function buildTelegramShareUrl(url: string, title?: string): string {
  const params = new URLSearchParams({ url });

  if (title?.trim()) {
    params.set('text', title.trim());
  }

  return `https://t.me/share/url?${params.toString()}`;
}

export function buildFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({ u: url });

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function buildWhatsAppShareUrl(url: string, title?: string): string {
  const text = title?.trim() ? `${title.trim()} ${url}` : url;
  const params = new URLSearchParams({ text });

  return `https://wa.me/?${params.toString()}`;
}

export function buildViberShareUrl(url: string, title?: string): string {
  const text = title?.trim() ? `${title.trim()} ${url}` : url;

  return `viber://forward?text=${encodeURIComponent(text)}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy copy
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    return copied;
  } catch {
    return false;
  }
}
