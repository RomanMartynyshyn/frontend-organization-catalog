import type { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function TextLink({ className, href, ...props }: TextLinkProps) {
  const classes = cn(
    'font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    className,
  );
  if (href.startsWith('#')) {
    return <a href={href} className={classes} {...props} />;
  }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
