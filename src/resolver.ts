/**
 *
 *
 * resolveBoard(orders: Order[]): BoardState {
 *  doMagiks();
 * }
 */

import { Order, TerritoryDefinition, BoardState } from './types';
import { isTargettingTerritory } from './util';
import { OrderType } from './const';


/**
 * validates the pertinent data for each order type, returning a boolean if the order is illegal or impossible.
 *  @param order The order to be validated. 
 */
export function validateAbstractOrder(order: Order): boolean {
    switch(order.type) {
        case OrderType.MOVE:
            return validateMoveOrder(order);
        case OrderType.HOLD:
            return validateHoldOrder(order);
        default: {
            // validate orders based on type.
        }
    }
}


export function deriveInitialBoardStateFromOrders(orders: Order[], territories: TerritoryDefinition[]): BoardState {

    const boardState = territories.reduce<BoardState>((acc, curr) => {
        acc[curr.name] = {
            occupied: orders.find(order => order.origin === curr.name) !== undefined
        }
        return acc;
    }, {});

    return boardState;
}

export function deriveContestedTerrritoriesFromOrders(orders: Order[], territories: TerritoryDefinition[]): BoardState {

    const boardState = territories.reduce<BoardState>((acc, curr) => {
        acc[curr.name] = {
            occupied: orders.find(order => order.origin === curr.name) !== undefined,
            contested: orders.filter(order => isTargettingTerritory(order, curr)).length > 1
        }
        return acc;
    }, {});

    return boardState;
}
