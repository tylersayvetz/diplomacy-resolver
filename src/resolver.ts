/**
 *
 *
 * resolveBoard(orders: Order[]): BoardState {
 *  doMagiks();
 * }
 */

import { Order, TerritoryDefinition, BoardState } from './types';
import { isTargettingTerritory } from './util';

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
