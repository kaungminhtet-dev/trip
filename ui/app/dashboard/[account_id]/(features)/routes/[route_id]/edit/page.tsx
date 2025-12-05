import {
  ICreateRoute,
  IRoute,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { RouteForm } from '../../components/route-form';
import { fetchRouteById, getCities, getOperators } from '../../lib/mock-api';

interface EditRoutePageProps {
  params: {
    account_id: string;
    route_id: string;
  };
}

export default async function EditRoutePage({ params }: EditRoutePageProps) {
  params = await params;
  return (
    <div className="container px-1 py-1 space-y-4">
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={`/dashboard/${params.account_id}/routes/${params.route_id}`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Edit
            Route</h1>
        </div>
      </div>

      <Suspense fallback={<RouteFormSkeleton />}>
        <EditRouteContent id={params.route_id} />
      </Suspense>
    </div>
  );
}

async function EditRouteContent({ id }: { id: string }) {
  const cities = await getCities();
  const operators = await getOperators();
  const route = (await fetchRouteById(id)) as IRoute;
  const createRoute: ICreateRoute = {
    origin: cities.filter((city) => city.name === route.origin)[0].id,
    destination: cities.filter((city) => city.name === route.destination)[0].id,
    arrival: new Date(route.arrival),
    departure: new Date(route.departure),
    operatorId: route.operator.id,
    departureStationId: route.departureStation.id,
    arrivalStationId: route.arrivalStation.id,
    transportType: route.transportType,
  };

  if (!route) {
    notFound();
  }

  return (
    <RouteForm
      routeId={route.id}
      initialRoute={createRoute}
      cities={cities}
      operators={operators}
    />
  );
}

function RouteFormSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}
