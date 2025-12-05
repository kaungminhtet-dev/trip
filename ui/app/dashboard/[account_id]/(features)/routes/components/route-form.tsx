'use client';

import {
  ICity,
  ICreateRoute,
  IOperator,
  IStation,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/types';
import { DateTimePicker } from '@/components/date-time-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ComboBox } from '@/components/ui/combo-box';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createRoute, getStations, updateRoute } from '../lib/mock-api';

const routeFormSchema = z.object({
  origin: z.uuid({ error: 'Please select a origin city' }),
  destination: z.uuid({ error: 'Please select a destination city' }),
  departure: z.date('Please select departure date'),
  arrival: z.date('Please select arrival date'),
  transportType: z.enum(['BUS', 'TRAIN', 'FLIGHT'], 'Please select a transport type'),
  operatorId: z.uuidv4('Please select an operator'),
  departureStationId: z.uuidv4('Please select a departure station'),
  arrivalStationId: z.uuidv4('Please select an arrival station'),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

interface RouteFormProps {
  routeId?: string;
  cities: ICity[];
  operators: IOperator[];
  initialRoute?: ICreateRoute;
}

const defaultRoute: ICreateRoute = {
  origin: '',
  destination: '',
  departure: new Date(),
  arrival: new Date(Date.now() + 3600000 * 24),
  transportType: 'BUS',
  operatorId: '',
  departureStationId: '',
  arrivalStationId: '',
};

export function RouteForm({
                            routeId,
                            initialRoute,
                            cities,
                            operators,
                          }: RouteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departureStations, setDepartureStations] = useState<IStation[]>([]);
  const [arrivalStations, setArrivalStations] = useState<IStation[]>([]);

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: initialRoute ?? defaultRoute,
  });
  const origin = form.watch('origin');
  const destination = form.watch('destination');

  useEffect(() => {
    if (origin) {
      (async () => {
        const stations = await getStations(origin);
        setDepartureStations(stations);
      })();
    }

    if (destination) {
      (async () => {
        const stations = await getStations(destination);
        setArrivalStations(stations);
      })();
    }
  }, [origin, destination, form]);

  async function onSubmit(values: RouteFormValues) {
    setIsSubmitting(true);
    try {
      let data: { success: boolean; message: string };
      if (initialRoute && routeId) {
        data = await updateRoute(routeId, values);
      } else {
        data = await createRoute(values);
      }
      
      if (data.success) {
        toast.success('Route created', {
          description: data.message,
        });
        form.reset(defaultRoute);
      } else {
        toast.error('Error', {
          description: data.message,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full shadow-xl border-0 backdrop-blur-sm rounded-xl">
      <CardContent className="p-4">
        <form
          id={'new-route-form'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name={'origin'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={'origin'}>Origin</FieldLabel>
                  <ComboBox
                    placeholder={'Select origin'}
                    values={cities}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'destination'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={'destination'}>Destination</FieldLabel>
                  <ComboBox
                    placeholder={'Select destination'}
                    values={cities}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'departure'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'departure'}>Departure</FieldLabel>
                  <DateTimePicker
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
              name={'arrival'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'arrival'}>Arrival</FieldLabel>
                  <DateTimePicker
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
              name={'transportType'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'transportType'}>Transport
                    Type</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="TRAIN">Train</SelectItem>
                      <SelectItem value="FLIGHT">FLIGHT</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'operatorId'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'operatorId'}>Operator</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem key={operator.id} value={operator.id}>
                          {operator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'departureStationId'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'departureStationId'}>Departure
                    Station</FieldLabel>
                  <ComboBox
                    placeholder={'Select destination station...'}
                    values={departureStations}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'arrivalStationId'}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={'arrivalStationId'}>Departure
                    Station</FieldLabel>
                  <ComboBox
                    placeholder={'Select destination station...'}
                    values={arrivalStations}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="border-t rounded-b-xl">
        <Field orientation="horizontal" className="flex gap-4 ml-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            form={'new-route-form'}
            type="submit"
            disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : initialRoute
                ? 'Update Route'
                : 'Create Route'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}