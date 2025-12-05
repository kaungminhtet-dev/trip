"use server";

import { ApiResponse, Query } from '@/lib/type';
import { faker } from '@faker-js/faker';
import {
  ICity,
  ICreateRoute,
  IOperator,
  IRoute,
  IRouteList,
  IStation,
} from './types';

faker.seed(123);

const transportTypes = ["BUS", "TRAIN", "FLIGHT"] as const;

const cities: ICity[] = [
  { id: faker.string.uuid(), name: faker.location.city() },
  { id: faker.string.uuid(), name: faker.location.city() },
  { id: faker.string.uuid(), name: faker.location.city() },
  { id: faker.string.uuid(), name: faker.location.city() },
  { id: faker.string.uuid(), name: faker.location.city() },
];

const stations: { id: string, city: string; stations: IStation[] }[] = cities.map(
  (city) => ({
    id: city.id,
    city: city.name,
    stations: Array.from({ length: 10 }).map(() => ({
      id: faker.string.uuid(),
      name: faker.location.city(),
    })),
  })
);

const operators: IOperator[] = [
  { id: faker.string.uuid(), name: "operator 1" },
  { id: faker.string.uuid(), name: "operator 2" },
  { id: faker.string.uuid(), name: "operator 3" },
];

export async function getCities(): Promise<ICity[]> {
  return cities;
}

export async function getStations(city: string): Promise<IStation[]> {
  const filteredStations = stations.filter((station) => station.id === city);
  return filteredStations[0].stations;
}

export async function getOperator(id: string): Promise<IOperator> {
  return operators.find((op) => op.id == id) as IOperator;
}

export async function getStation(cityId: string, stationId: string): Promise<IStation> {
  const stations = await getStations(cityId)
  return stations.find((station) => station.id == stationId) as IStation;
}

export async function getOperators() {
  return operators;
}

function randomCity() {
  return faker.helpers.arrayElement(cities);
}

function randomStation(cityId: string): IStation {
  return faker.helpers.arrayElement(
    stations.filter((station) => station.city === cityId)[0].stations
  );
}

function randomOperator(): IOperator {
  return faker.helpers.arrayElement(operators);
}

const routes: IRoute[] = Array.from({ length: 100 }).map(() => {
  const origin = randomCity().name;
  const destination = randomCity().name;
  const departure = faker.date.soon({ days: 1 });
  const duration = faker.number.int({ min: 30, max: 600 });
  const arrival = new Date(departure.getTime() + duration * 60000);
  const transportType = faker.helpers.arrayElement(transportTypes);

  return {
    id: faker.string.uuid(),
    departure: departure.toISOString(),
    arrival: arrival.toISOString(),
    origin,
    destination,
    duration,
    transportType,
    images: [
      faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
    ],
    operator: randomOperator(),
    departureStation: randomStation(origin),
    arrivalStation: randomStation(destination),
  };
});

export async function searchRoutes(
  query: Query
): Promise<ApiResponse<IRoute[]>> {
  const filteredRoutes = routes.filter(
    (route) =>
      route.origin.toLowerCase().includes(query.search?.toLowerCase() || "") ||
      route.destination
        .toLowerCase()
        .includes(query.search?.toLowerCase() || "")
  );

  return {
    message: "Routes are successfully fetched.",
    success: true,
    data: filteredRoutes.slice(
      query.page * query.limit,
      query.page * query.limit + query.limit
    ),
    metaData: {
      limit: query.limit,
      page: query.page + 1,
      totalCounts: filteredRoutes.length,
      totalPages: Math.ceil(filteredRoutes.length / query.limit),
    },
  };
}

export async function fetchRouteList(
  query: Query
): Promise<ApiResponse<IRouteList[]>> {
  if (query.search) {
    return searchRoutes(query);
  }

  const start = query.page * 10;
  const routeList: IRouteList[] = routes
    .slice(start, start + query.limit)
    .map((route) => ({
      id: route.id,
      departure: route.departure,
      arrival: route.arrival,
      origin: route.origin,
      destination: route.destination,
      duration: route.duration,
      transportType: route.transportType,
    }));

  return {
    message: "Routes are successfully fetched.",
    success: true,
    data: routeList,
    metaData: {
      limit: query.limit,
      page: query.page + 1,
      totalCounts: routeList.length,
      totalPages: Math.floor(routes.length / query.limit),
    },
  };
}

export async function fetchRoutes(
  query: Query
): Promise<ApiResponse<IRoute[]>> {
  const start = query.page * 10;
  const data: IRoute[] = routes.slice(start, start + query.limit);

  return {
    message: "Routes are successfully fetched.",
    success: true,
    data: data,
    metaData: {
      limit: query.limit,
      page: query.page + 1,
      totalCounts: routes.length,
      totalPages: routes.length / query.limit,
    },
  };
}

export async function fetchRouteById(id: string) {
  return routes.find((route) => route.id === id);
}

export async function createRoute(
  route: ICreateRoute
): Promise<ApiResponse<IRoute>> {
  const newRoute: IRoute = {
    ...route,
    id: faker.string.uuid(),
    departure: route.departure.toISOString(),
    arrival: route.arrival.toISOString(),
    duration: faker.number.int({ min: 30, max: 600 }),
    images: [
      faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
    ],
    operator: await getOperator(route.operatorId),
    departureStation: await getStation(route.origin, route.departureStationId),
    arrivalStation: await getStation(route.destination, route.arrivalStationId),
  };
  return {
    message: "Route is successfully created.",
    success: true,
    data: newRoute,
    metaData: null
  };
}

export async function updateRoute(id: string, route: ICreateRoute) {
  const updatedRoute = routes.find((route) => route.id === id);

  if (!updatedRoute) {
    return {
      message: `Route id ${id} is not found.`,
      success: false,
    };
  }

  updatedRoute.departure = route.departure.toISOString();
  updatedRoute.arrival = route.arrival.toISOString();
  updatedRoute.transportType = route.transportType;
  updatedRoute.operator = operators.find(
    (operator) => operator.id === route.operatorId
  ) as IOperator;

  return {
    message: "Route is successfully updated.",
    success: true,
    data: updatedRoute,
  };
}

export async function deleteRouteById(id: string): Promise<ApiResponse<null>> {
  return {
    message: `Route id ${id} is successfully deleted.`,
    success: true,
    metaData: null
  };
}
