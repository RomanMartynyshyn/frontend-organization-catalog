import Link from 'next/link';

import {
  PRIVACY_POLICY_UPDATED_AT,
  privacyPolicySections,
} from '@/content/privacy-policy';
import { routes } from '@/config/routes';

export const metadata = {
  title: 'Політика приватності даних',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-[800px] space-y-8 pb-12">
      <nav className="text-sm" aria-label="Breadcrumb">
        <Link href={routes.home} className="text-black hover:underline">
          Головна
        </Link>
        <span className="text-[#666666]"> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          Політика приватності даних
        </span>
      </nav>

      <header className="space-y-2">
        <h1 className="font-eUkraine text-[28px] leading-[32px] font-semibold text-black">
          Політика приватності даних
        </h1>
        <p className="text-sm text-[#666666]">
          Останнє оновлення: {PRIVACY_POLICY_UPDATED_AT}
        </p>
      </header>

      <div className="font-eUkraine space-y-8 text-sm leading-relaxed text-black sm:text-base">
        {privacyPolicySections.map((section) => (
          <section key={section.id} className="space-y-4">
            {section.title ? (
              <h2 className="text-lg font-bold text-black sm:text-xl">{section.title}</h2>
            ) : null}
            <div className="space-y-4">{section.content}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
