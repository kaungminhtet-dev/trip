"use client";

import {
  ICity,
  IOperator,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/types';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlidersHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export interface RouteFilterProps {
  operators: IOperator[],
  cities: ICity[],
}

const filterSchema = z.object({
  departure: z.date('Please set departure date').optional(),
  arrival: z.date('Please set departure date').optional(),
  operator: z.uuidv4('Invalid operator').optional(),
  origin: z.uuidv4('Invalid origin city').optional(),
  destination: z.uuidv4('Invalid destination city').optional(),
});

type FilterType = z.infer<typeof filterSchema>;

const defaultFilter:FilterType = {
  departure: undefined,
  arrival: undefined,
  origin: undefined,
  destination: undefined,
  operator: undefined,
}

export function RouteFilter({ operators, cities }: RouteFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const form = useForm<FilterType>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      departure: undefined,
      arrival: undefined,
      operator: undefined,
      origin: undefined,
      destination: undefined,
    },
  });

  const onSubmit = (values: FilterType) => {
    const params = new URLSearchParams(searchParams as unknown as string);
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          params.set(key, value.toISOString());
        } else {
          params.set(key, value as string);
        }
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
    form.reset(defaultFilter)
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={'w-max'}>
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Route Filters</SheetTitle>
          <SheetDescription>
            Filter routes by various criteria
          </SheetDescription>
        </SheetHeader>
        <form
          className={'px-1'}
          id={'filter-form'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div
              className={'grid grid-cols-2 gap-2 auto-rows-[1fr]'}>
              <Controller
                control={form.control}
                name={'departure'}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={'overflow-hidden'}
                  >
                    <FieldLabel>Departure Date</FieldLabel>
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
              />
              <Controller
                control={form.control}
                name={'arrival'}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={'overflow-hidden'}
                  >
                    <FieldLabel>Arrival Date</FieldLabel>
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
              />
              <Controller
                control={form.control}
                name={'origin'}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Origin</FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <SelectTrigger>
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
              />
              <Controller
                control={form.control}
                name={'destination'}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={"destination"}>Destination</FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue id={"destination"} placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          cities.map((city) => (
                            <SelectItem key={city.id}
                                        value={city.id}>{city.name}</SelectItem>
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
              />
              <Controller
                control={form.control}
                name={'operator'}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Operator</FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={'Select operator'} />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          operators.map((operator) => (
                            <SelectItem key={operator.id}
                                        value={operator.id}>{operator.name}</SelectItem>
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
              />
            </div>
          </FieldGroup>
        </form>
        <SheetFooter className="flex gap-2 flex-row justify-end">
          <Button variant="outline" onClick={() => form.reset(defaultFilter)}>Reset</Button>
          <Button form={'filter-form'} type={'submit'}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
