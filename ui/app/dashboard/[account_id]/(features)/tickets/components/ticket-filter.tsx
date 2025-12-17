'use client';

import {
  ICity,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatURLDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface TicketFilterProps {
  cities: ICity[];
}

const ticketFilterSchema = z.object({
  departure: z.date().optional(),
  status: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
});

type FilterSchema = z.infer<typeof ticketFilterSchema>;

const defaultFilter: FilterSchema = {
  status: 'all',
  departure: undefined,
  origin: undefined,
  destination: undefined,
};


export function TicketFilter({ cities }: TicketFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();
  const form = useForm<FilterSchema>({
    resolver: zodResolver(ticketFilterSchema),
    defaultValues: defaultFilter,
  });

  const onSubmit = (values: FilterSchema) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (values.departure) {
      params.set('departure', formatURLDate(values.departure));
    } else {
      params.delete('departure');
    }

    if (values.status && values.status.toLowerCase() !== 'all') {
      params.set('status', values.status);
    } else {
      params.delete('status');
    }

    if (values.origin) {
      params.set('origin', values.origin);
    } else {
      params.delete('origin');
    }

    if (values.destination) {
      params.set('destination', values.destination);
    } else {
      params.delete('destination');
    }

    replace(`${pathname}?${params.toString()}`);
  };
  const handleReset = () => {
    form.reset(defaultFilter);
    replace(pathname);
  };

  return (
    <form
      id={'ticket-filter-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-row items-end gap-2"
    >
      <Controller
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className={'overflow-hidden'}
          >
            <DatePicker
              date={field.value}
              setDate={field.onChange}
            />
            {
              fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />)
            }
          </Field>
        )}
        name={'departure'}
      />

      <Controller
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className={'overflow-hidden'}
          >
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {
              fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />)
            }
          </Field>
        )}
        name={'status'}
      />

      <Controller
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select
              value={field.value ?? ''}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {
                  cities.map((city) => (
                    <SelectItem
                      key={city.id}
                      value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {
              fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )
            }
          </Field>
        )}
        name={'origin'}
      />

      <Controller
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select
              value={field.value ?? ''}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {
                  cities.map((city) => (
                    <SelectItem
                      key={city.id}
                      value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {
              fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )
            }
          </Field>
        )}
        name={'destination'}
      />

      <div className={'flex gap-1'}>
        <Button type={'submit'} variant={'outline'}>Apply</Button>
        <Button variant={'outline'} onClick={handleReset}>Reset</Button>
        <Button variant="outline" size="icon" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

    </form>
  );
}
