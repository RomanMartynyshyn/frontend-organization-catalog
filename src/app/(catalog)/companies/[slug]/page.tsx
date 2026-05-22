import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCompanyBySlug } from '@/lib/companies/getCompanyBySlug';
import { routes } from '@/config/routes';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStarsDisplay } from '@/components/ui/RatingStars';
import { cn } from '@/lib/cn';

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <div>
        <Link
          href={routes.home}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'px-0',
          )}
        >
          ← На головну
        </Link>
      </div>
      <header className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">{company.name}</h1>
        <p className="text-muted text-sm">ЄДРПОУ: {company.edrpou}</p>
        <RatingStarsDisplay
          value={company.rating}
          size="md"
          fractional
          ariaLabel={`Рейтинг ${company.rating} з 5`}
        />
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Про компанію</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted leading-relaxed">
            {company.shortDescription}
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
