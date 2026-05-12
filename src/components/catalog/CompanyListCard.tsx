import Link from 'next/link';
import type { Company } from '@/types/company';
import { routes } from '@/config/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CompanyListCardProps = {
  company: Company;
};

export function CompanyListCard({ company }: CompanyListCardProps) {
  return (
    <Link
      href={routes.company(company.slug)}
      className="focus-visible:outline-ring block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">{company.name}</CardTitle>
          <CardDescription>ЄДРПОУ: {company.edrpou}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted line-clamp-3 text-sm leading-relaxed">
            {company.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
