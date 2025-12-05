import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { RouteDetail } from '../components/route-detail';

interface RouteDetailPageProps {
  params: {
    account_id: string;
    route_id: string;
  };
}

export default async function RouteDetailPage({
  params,
}: RouteDetailPageProps) {
  params = await params;

  return (
    <div className="container flex mx-auto items-start space-y-2 p-1 gap-1">
      <Button variant="outline" size="icon" asChild>
        <Link href={`/dashboard/${params.account_id}/routes`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      <Suspense fallback={<RouteDetailSkeleton />}>
        <RouteDetail accountId={params.account_id} routeId={params.route_id} />
      </Suspense>
    </div>
  );
}

function RouteDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    </div>
  );
}
