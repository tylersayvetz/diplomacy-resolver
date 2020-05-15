import {
    MoveOrder,
    TerritoryDefinition,
    TerritoryNeighborDefinition,
    SupportHoldOrder,
    SupportMoveOrder,
} from '../types';
import { hasNeighbor } from './util';

import { TerritoryType } from '../const';

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

export function validMoveByConvoy(order: MoveOrder, territories: TerritoryDefinition[]): boolean {
    //do a BFS
    //see if there is a water path between the origin and the target.
    const originTerritory = territories.find((t) => t.name === order.origin);
    if (!originTerritory) return false;

    const queue = [originTerritory];
    while (queue.length) {
        const current = queue.shift();

        //if current has a neighbor who is the target of the order, return true.
        if (
            current.neighbors.find((n: TerritoryNeighborDefinition) => n.to === order.target) !==
            undefined
        )
            return true;

        //otherwise push each coastal neighbor territory to the queue
        if (current.coastalNeighbors !== null) {
            current.coastalNeighbors.forEach((n: TerritoryNeighborDefinition) => {
                queue.push(
                    territories.find((t) => t.name === n.to && t.type === TerritoryType.SEA)
                );
            });
        }
    }
    //if the queue is empty, there is no path to the target territory.
    return false;
}
