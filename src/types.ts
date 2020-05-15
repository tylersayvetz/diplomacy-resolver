import { TerritoryType, OrderType, UnitType } from './const';

//this is the reference. It is static information about the map.
export interface TerritoryDefinition {
    name: string;
    type: TerritoryType;
    country: string;
    neighbors: TerritoryNeighborDefinition[];
    coastalNeighbors: TerritoryNeighborDefinition[] | null;
}

export interface TerritoryStatus {
    territory: TerritoryDefinition;
    contested: boolean;
    contestants: Contestant[] | null;
    occupant: OrderStatus | null;
}

export type ConvoyRoute = TerritoryStatus[][];

export interface Contestant {
    convoyRoutes?: ConvoyRoute | null;
    territory: TerritoryStatus;
}

export interface OrderStatus {
    order: Order;
    resolution: boolean | null;
    convoyRoutes: ConvoyRoute | null;
    supports: TerritoryStatus[];
}


export interface BoardState {
    [territoryName: string]: {
        occupied: boolean;
        contested: boolean;
    };
}

export interface TerritoryNeighborDefinition {
    to: string;
    army: boolean;
    fleet: boolean;
}

export interface AbstractOrder {
    type: OrderType;
    country: string;
    origin: string;
    unit: UnitType;
    success: boolean;
}

export interface HoldOrder extends AbstractOrder {
    type: typeof OrderType.HOLD;
}

export interface MoveOrder extends AbstractOrder {
    type: typeof OrderType.MOVE;
    target: string;
}
export interface SupportMoveOrder extends AbstractOrder {
    type: typeof OrderType.SUPPORT_MOVE;
    target: string;
    into: string;
}
export interface SupportHoldOrder extends AbstractOrder {
    type: typeof OrderType.SUPPORT_HOLD;
    target: string;
}
export interface BuildOrder extends AbstractOrder {
    type: typeof OrderType.BUILD;
}
export interface DestroyOrder extends AbstractOrder {
    type: typeof OrderType.DESTROY;
}
export interface ConvoyOrder extends AbstractOrder {
    type: typeof OrderType.CONVOY;
    target: string;
    into: string;
}

export type Order =
    | HoldOrder
    | MoveOrder
    | SupportMoveOrder
    | SupportHoldOrder
    | BuildOrder
    | ConvoyOrder
    | DestroyOrder;
