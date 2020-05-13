/**
 *
 *
 * resolveBoard(orders: Order[]): BoardState {
 *  doMagiks();
 * }
 */

import { Order, TerritoryDefinition, BoardState } from './types';
import {
    isTargettingTerritory
    // validateConvoy,
    // validateHold,
} from './util/util';
import { validateMove, validateSupportHold, validateSupportMove } from './util/order-validators';
import { OrderType } from './const';

/**
 * validates the pertinent data for each order type, returning a boolean if the order is illegal or impossible.
 *  @param order The order to be validated.
 */
export function validateAbstractOrder(order: Order, territories: TerritoryDefinition[]): boolean {
    switch (order.type) {
        case OrderType.MOVE:
            return validateMove(order, territories);
        case OrderType.SUPPORT_HOLD:
            return validateSupportHold(order, territories);
        case OrderType.SUPPORT_MOVE:
            return validateSupportMove(order, territories);
        // case OrderType.CONVOY:
        // return validateConvoy(order, territories);
        default: {
            return true;
        }
    }
}

export function deriveInitialBoardStateFromOrders(
    orders: Order[],
    territories: TerritoryDefinition[]
): BoardState {
    const boardState = territories.reduce<BoardState>((acc, curr) => {
        acc[curr.name] = {
            occupied: orders.find((order) => order.origin === curr.name) !== undefined
        };
        return acc;
    }, {});

    return boardState;
}

export function deriveContestedTerrritoriesFromOrders(
    orders: Order[],
    territories: TerritoryDefinition[]
): BoardState {
    const boardState = territories.reduce<BoardState>((acc, curr) => {
        acc[curr.name] = {
            occupied: orders.find((order) => order.origin === curr.name) !== undefined,
            contested: orders.filter((order) => isTargettingTerritory(order, curr)).length > 1
        };
        return acc;
    }, {});

    return boardState;
}
