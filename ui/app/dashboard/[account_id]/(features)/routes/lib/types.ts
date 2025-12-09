export type TransportType = 'BUS' | 'TRAIN' | 'FLIGHT';

export interface IRoute {
  id: string;
  departure: string;
  arrival: string;
  origin: string;
  destination: string;
  duration: number;
  transportType: TransportType;
  images: string[];
  operator: IOperator;
  departureStation: IStation;
  arrivalStation: IStation;
}

export interface IRouteList {
  id: string;
  departure: string;
  arrival: string;
  origin: string;
  destination: string;
  duration: number;
  transportType: string;
}

export interface ICreateRoute {
  departure: Date;
  arrival: Date;
  transportType: TransportType;
  origin: string;
  destination: string;
  operatorId: string;
  departureStationId: string;
  arrivalStationId: string;
}

export interface ICity {
  id: string;
  name: string;
}

export interface IStation {
  id: string;
  name: string;
}

export interface IOperator {
  id: string;
  name: string;
}

export interface IQuery {
  order_by: string;
  sort_by: string;
  page: string;
  size: string;
  search?: string;
  departure?: Date;
  arrival?: Date;
  origin?: string;
  destination?: string;
}
