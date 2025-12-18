import {
  TicketNewForm,
} from '@/app/dashboard/[account_id]/(features)/tickets/components/ticket-new-form';
import {
  fetchRoute,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/mock-api';
import {
  IRoute,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import { TicketURL } from '@/app/dashboard/[account_id]/data/consts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: {
    account_id: string;
  };
}

export default async function NewTicketPage({ params }: Props) {
  const response = await fetchRoute(new Date());

  return (
    <main className={'container flex flex-col gap-1'}>
      <div className={'h-12 flex gap-1 p-1'}>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/${params.account_id}/${TicketURL}`}>
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className={'text-2xl font-bold tracking-tight text-slate-100'}>
          Create New Ticket
        </h2>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
          <CardDescription>
            Enter the details for the new ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketNewForm routes={response.data as IRoute[]} />
        </CardContent>
      </Card>
    </main>
  );
}
