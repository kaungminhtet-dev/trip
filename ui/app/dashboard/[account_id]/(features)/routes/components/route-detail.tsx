import {
  EditAndDeleteButton,
} from '@/app/dashboard/[account_id]/(features)/routes/components/delete_button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { fetchRouteById } from '../lib/mock-api';
import { formatDate, formatDuration } from '../lib/utils';
import { RouteImages } from './route-images';

interface RouteDetailProps {
  accountId: string;
  routeId: string;
}

export async function RouteDetail({ accountId, routeId }: RouteDetailProps) {
  const route = await fetchRouteById(routeId);

  if (!route) {
    return (
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No route found
        </h4>
      </div>
    );
  }

  return (
    <Tabs className={"w-full pl-1 pr-1"} defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        {/*<TabsTrigger value="tickets">Tickets</TabsTrigger>*/}
      </TabsList>
      <TabsContent value="details" className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className={'col-span-2'}>
            <CardHeader>
              <CardAction>
                <EditAndDeleteButton
                  account_id={accountId}
                  route_id={routeId}
                />
              </CardAction>
              <CardTitle>Route Information</CardTitle>
              <CardDescription>Basic route details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Origin
                  </h3>
                  <p className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {route.origin}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Destination
                  </h3>
                  <p className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {route.destination}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Departure
                  </h3>
                  <p className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(route.departure)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Arrival
                  </h3>
                  <p className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(route.arrival)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Duration
                  </h3>
                  <p className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDuration(route.duration)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Transport Type
                  </h3>
                  <p className="mt-1">
                    <Badge variant="outline">{route.transportType}</Badge>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Operator
                </h3>
                <p className="flex items-center gap-1 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {route.operator.name}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={'col-span-1'}>
            <CardHeader>
              <CardTitle>Station Information</CardTitle>
              <CardDescription>Departure and arrival stations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Departure Station
                </h3>
                <div className="mt-2 p-3 border rounded-md">
                  <p className="font-medium">{route.departureStation.name}</p>
                  {/*                    <p
                      className="text-sm text-muted-foreground">{route.departureStation.address}</p>
                    {route.departureStation.description && (
                      <p
                        className="text-sm mt-2">{route.departureStation.description}</p>
                    )}*/}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Arrival Station
                </h3>
                <div className="mt-2 p-3 border rounded-md">
                  <p className="font-medium">{route.arrivalStation.name}</p>
                  {/*                    <p
                      className="text-sm text-muted-foreground">{route.arrivalStation.address}</p>
                    {route.arrivalStation.description && (
                      <p
                        className="text-sm mt-2">{route.arrivalStation.description}</p>
                    )}*/}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="images">
        <RouteImages images={route.images} routeId={route.id} />
      </TabsContent>

      {/*<TabsContent value="tickets">*/}
      {/*  <Card>*/}
      {/*    <CardHeader>*/}
      {/*      <CardTitle>Tickets</CardTitle>*/}
      {/*      <CardDescription>Available tickets for this*/}
      {/*        route</CardDescription>*/}
      {/*    </CardHeader>*/}
      {/*    <CardContent>*/}
      {/*      {route.tickets && route.tickets.length > 0 ? (*/}
      {/*        <div className="space-y-4">*/}
      {/*          {route.tickets.map((ticket) => (*/}
      {/*            <div key={ticket.id} className="p-4 border rounded-md">*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <div>*/}
      {/*                  <p className="font-medium">{ticket.type}</p>*/}
      {/*                  <p*/}
      {/*                    className="text-sm text-muted-foreground">{ticket.description}</p>*/}
      {/*                </div>*/}
      {/*                <div className="text-right">*/}
      {/*                  <p*/}
      {/*                    className="font-bold">${ticket.price.toFixed(2)}</p>*/}
      {/*                  <p*/}
      {/*                    className="text-sm text-muted-foreground">{ticket.available ? 'Available' : 'Sold out'}</p>*/}
      {/*                </div>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          ))}*/}
      {/*        </div>*/}
      {/*      ) : (*/}
      {/*        <p className="text-muted-foreground">No tickets available for*/}
      {/*          this route.</p>*/}
      {/*      )}*/}
      {/*    </CardContent>*/}
      {/*  </Card>*/}
      {/*</TabsContent>*/}
    </Tabs>
  );
}
