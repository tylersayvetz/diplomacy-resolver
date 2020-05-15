import { Order, TerritoryDefinition, MoveOrder, SupportHoldOrder, SupportMoveOrder } from '../types';
import { OrderType, TerritoryType } from '../const';

export function isTargettingTerritory(order: Order, territory: TerritoryDefinition): boolean {
    //is holding and therefor intends to occupy the territory
    const holding = order.type === OrderType.HOLD || order.type === OrderType.SUPPORT_HOLD;
    //is targetting the territory aggressively
    const targetting = order.type === OrderType.MOVE && order.target === territory.name;
    //is targetting the territory in a supporting manner
    const supporting = order.type === OrderType.SUPPORT_MOVE && order.target === territory.name;

    return holding || targetting || supporting;
}


// export function validateConvoy(order: Order): boolean {}
/**
 * 
 * Determines if an order's origin has an immediate neighbor with its target.
 * 
 * @param origin name of the origin of the order
 * @param target name of the target of the order
 * @param territories all territories.
 */
export function hasNeighbor(
    origin: string,
    target: string,
    territories: TerritoryDefinition[]
): boolean {
    const currentTerritory = territories.find((t) => t.name === origin)
    const landNeighbor = currentTerritory.neighbors.find((n) => n.to === target) !== undefined
    const seaNeighbor = currentTerritory.coastalNeighbors 
        ? currentTerritory.coastalNeighbors.find((n) => n.to === target) !== undefined 
        : false
    return landNeighbor  || seaNeighbor
}

