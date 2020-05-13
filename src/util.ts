import { Order, TerritoryDefinition, MoveOrder, SupportHoldOrder, SupportMoveOrder } from './types';
import { OrderType, TerritoryType } from './const';

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
    return validNeighbor || validMoveByConvoy(order, territories);
}
// export function validateHold(order: Order): boolean {}
export function validateSupportHold(
    order: SupportHoldOrder,
    territories: TerritoryDefinition[]
): boolean {
    const targetIsNeighbor = hasNeighbor(order.origin, order.target, territories);
    return targetIsNeighbor;
}
export function validateSupportMove(
    order: SupportMoveOrder,
    territories: TerritoryDefinition[]
): boolean {
    const targetIsNeighbor = hasNeighbor(order.origin, order.target, territories);
    const intoIsNeighbor = hasNeighbor(order.origin, order.into, territories);
    return intoIsNeighbor && targetIsNeighbor;
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

export function validMoveByConvoy(order: MoveOrder, territories: TerritoryDefinition[]): boolean {
    //do a BFS
    //see if there is a water path between the origin and the target.
    const originTerritory = territories.find((t) => t.name === order.origin);
    if (!originTerritory) return false;
    // console.log('origin territory:', originTerritory);

    const queue = [originTerritory];
    while (queue.length) {
        const current = queue.shift();

        //if current has a neighbor who is the target of the order, return true.
        if (current.neighbors.find((n) => n.to === order.target) !== undefined) return true;

        //otherwise push each coastal neighbor territory to the queue
        if (current.coastalNeighbors !== null) {
            current.coastalNeighbors.forEach((n) => {
                queue.push(
                    territories.find((t) => t.name === n.to && t.type === TerritoryType.SEA)
                );
            });
        }
    }
    //if the queue is empty, there is no path to the target territory.
    return false;
}
