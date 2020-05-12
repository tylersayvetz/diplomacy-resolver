import { Order, TerritoryDefinition, MoveOrder, SupportHoldOrder, SupportMoveOrder } from './types';
import { OrderType } from './const';

export function isTargettingTerritory(order: Order, territory: TerritoryDefinition): boolean {
    //is holding and therefor intends to occupy the territory
    const holding = order.type === OrderType.HOLD || order.type === OrderType.SUPPORT_HOLD;
    //is targetting the territory aggressively
    const targetting = order.type === OrderType.MOVE && order.target === territory.name;
    //is targetting the territory in a supporting manner
    const supporting = order.type === OrderType.SUPPORT_MOVE && order.target === territory.name;

    return holding || targetting || supporting;
}

//assigns a HOLD order to any unit who was not assigned an order by the player.
export function assignHoldOrderToNoOp(): void {
    //might not need this. Depeneding on data structure decisions with the boardStatus.
}

//decide if each move is possible (legal).
export function validateMove(order: MoveOrder, territories: TerritoryDefinition[]): boolean {
    const validNeighbor = hasNeighbor(order.origin, order.target, territories);
    return validNeighbor;
    
}
// export function validateHold(order: Order): boolean {}
export function validateSupportHold(order: SupportHoldOrder, territories: TerritoryDefinition[]): boolean {
    const targetIsNeighbor = hasNeighbor(order.origin, order.target, territories)
    return targetIsNeighbor;
}
export function validateSupportMove(order: SupportMoveOrder, territories: TerritoryDefinition[]): boolean {
    const targetIsNeighbor = hasNeighbor(order.origin, order.target, territories);
    const intoIsNeighbor = hasNeighbor(order.origin, order.into, territories);
    return intoIsNeighbor && targetIsNeighbor;
}
// export function validateConvoy(order: Order): boolean {}

export function hasNeighbor(origin: string, target: string, territories: TerritoryDefinition[]): boolean {
    return territories.find((t) => t.name === origin).neighbors.find((n) => n.to === target) !== undefined;
}
