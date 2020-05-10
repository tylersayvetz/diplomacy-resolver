import { TerritoryType, OrderType } from "./const";

export interface TerritoryDefinition {
    name: string;
    type: TerritoryType;
    country: string;
    neighbors: TerritoryNeighborDefinition[],
    coastalNeighbors: TerritoryNeighborDefinition[] | null
}

export interface BoardState {
    [name: string]: {
        occupied: boolean
        contested?: boolean
    }
}

export interface TerritoryNeighborDefinition {
    to: string;
    army: boolean;
    fleet: boolean;
}

export interface AbstractOrder {
    type: OrderType,
    country: string,
    origin: string;
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

export type Order = HoldOrder | MoveOrder | SupportMoveOrder | SupportHoldOrder | BuildOrder | ConvoyOrder | DestroyOrder;
