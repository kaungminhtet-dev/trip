"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteRouteById } from '../lib/mock-api';
import { IRouteList } from '../lib/types';
import { formatDuration, formatTimeWithAMPM } from '../lib/utils';

interface RoutesTableProps {
  routes: IRouteList[];
}

export function RoutesTable({ routes }: RoutesTableProps) {
  const router = useRouter();
  if (!routes.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No routes found</CardTitle>
          <CardDescription>Create a new route to get started.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Table>
        <TableHeader className={"bg-primary/10"}>
          <TableRow>
            <TableHead className="hidden lg:table-cell">Origin - Destination</TableHead>
            <TableHead className="hidden lg:table-cell">Start - End</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Transport</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id} onClick={() => router.push(`routes/${route.id}`)}>
              <TableCell className="font-medium">
                {/*<div>*/}
                  <div className="font-medium">
                    {route.origin} - {route.destination}
                  </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="font-medium">
                  {formatTimeWithAMPM(route.departure)} - {formatTimeWithAMPM(route.arrival)}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDuration(route.duration)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant="outline">{route.transportType}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`routes/${route.id}`}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`routes/${route.id}/edit`}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => {
                        document
                          .getElementById(`delete-dialog-${route.id}`)
                          ?.click();
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog>
                  <AlertDialogTrigger
                    id={`delete-dialog-${route.id}`}
                    className="hidden"
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the route and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={async () => {
                          const resp = await deleteRouteById(route.id);
                          if (resp.success) {
                            router.refresh();
                            toast.success(resp.message);
                          } else {
                            toast.error(resp.message);
                          }
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
