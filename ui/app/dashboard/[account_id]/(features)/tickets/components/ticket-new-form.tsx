'use client';

import {
  IRoute,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  routes: IRoute[];
}

const CreateTicketFormSchema = z.object({
  departure: z.date('Please select departure date').optional(),
  routeId: z.uuid({ error: 'Please chose valid route' }),
  price: z.coerce.number<number>().min(0),
});

type CreateTicketFormValues = z.infer<typeof CreateTicketFormSchema>;
const defaultRoute: CreateTicketFormValues = {
  departure: undefined,
  routeId: '',
  price: 0,
};

export function TicketNewForm({ routes }: Props) {
  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(CreateTicketFormSchema),
    defaultValues: defaultRoute,
  });
  const onSubmit = (values: CreateTicketFormValues) => {
    console.log(values);
  };

  return (
    <div className={'flex flex-col gap-6 max-2xl'}>
      <form
        id={'create-ticket-form'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name={'departure'}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={'departure'}>Departure Date</FieldLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Routes</FieldLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        routes.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.origin} - {route.destination}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {
                  fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )
                }
              </Field>
            )}
            name={'routeId'}
          />

          <Controller
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Price</FieldLabel>
                <div className={'flex relative'}>
                  <Input type={"number"} {...field} />
                  <span
                    className={'h-full absolute right-2 text-gray-400' +
                      ' text-sm items-center content-center'}
                  >
                    MMK</span>
                </div>
                {
                  fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />)
                }
              </Field>
            )} name={'price'} />
        </FieldGroup>
      </form>
      <div className={"flex gap-2"}>
        <Button type="submit" form={'create-ticket-form'}>
          Create
        </Button>
        <Button variant={"outline"} onClick={() => form.reset(defaultRoute)}>
          Reset
        </Button>
      </div>
    </div>
  );
}