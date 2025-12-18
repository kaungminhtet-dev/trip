import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RouteForm } from '../components/route-form';
import { getCities, getOperators } from '../lib/mock-api';

interface NewRoutePageProps {
  params: {
    account_id: string;
  };
}

export default async function NewRoutePage({ params }: NewRoutePageProps) {
  const cities = await getCities();
  const operators = await getOperators();
  params = await params;

  return (
    <div className="min-h-screen container px-1 py-1 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/${params.account_id}/routes`}
                className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Create New Route
        </h1>
      </div>
      <RouteForm cities={cities} operators={operators} />
    </div>
  );
}
