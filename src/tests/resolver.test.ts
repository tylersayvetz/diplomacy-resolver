const countries = ['C1', 'C2', 'C3', 'C4'];
import { TerritoryType, OrderType, UnitType } from '../const';
import {
    TerritoryDefinition,
    Order,
    MoveOrder,
    HoldOrder,
    SupportHoldOrder,
    SupportMoveOrder
} from '../types';
import {
    deriveInitialBoardStateFromOrders,
    deriveContestedTerrritoriesFromOrders,
    validateAbstractOrder
} from '../resolver';
import { expect } from 'chai';
import { hasNeighbor } from '../lib/util';
import { validMoveByConvoy } from '../lib/order-validators';

//   +---------------+----+
//   |       |  sea  |    |
//   |  A    |  B    |  E | . <-- name of territory
//   |       |  C2   |    | . <--occupying power
//   |       |       |    |
//   +---------------+    |
//   |       |       |    |
//   |  C    |  D    |    |
//   |       |       |    |
//   |       |       |    |
//   +---------------+----+

//final data form example:
// {
//     "name": "Budapest",
//     "type": "Land",
//     "supply": true,
//     "country": "Austria",
//     "neighbors": [
//       { "to": "Serbia", "army": true, "fleet": false },
//       { "to": "Rumania", "army": true, "fleet": false },
//       { "to": "Vienna", "army": true, "fleet": false },
//       { "to": "Trieste", "army": true, "fleet": false },
//       { "to": "Galicia", "army": true, "fleet": false }
//     ],
//     "coastalNeighbors": null
//   }

/**
 * move data form example: 
 * 
  {
    "type": "SUPPORT_MOVE",
    "country": "RUSSIA",
    "territory": "Gulf of Bothnia",
    "territory_secondary": "Finland",
    "territory_tertiary": "Sweden"
  }
 */

/**
 * Dummy data representing the territories.
 */
export const territories: TerritoryDefinition[] = [
    {
        name: 'A',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [{ to: 'C', army: true, fleet: false }],
        coastalNeighbors: [{ to: 'B', army: true, fleet: false }]
    },
    {
        name: 'B',
        type: TerritoryType.SEA,
        country: countries[0],
        neighbors: [
            { to: 'A', army: true, fleet: false },
            { to: 'D', army: true, fleet: false }
        ],
        coastalNeighbors: null
    },
    {
        name: 'C',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [
            { to: 'A', army: true, fleet: false },
            { to: 'D', army: true, fleet: false }
        ],
        coastalNeighbors: null
    },
    {
        name: 'D',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [{ to: 'C', army: true, fleet: false }],
        coastalNeighbors: [{ to: 'B', army: true, fleet: false }]
    },
    {
        name: 'E',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [{ to: 'D', army: true, fleet: false }],
        coastalNeighbors: [{ to: 'B', army: true, fleet: false }]
    }
];

describe('maps initial board state', () => {
    it('returns a map of the board, showing territories as occupied or not', () => {
        const orders: Order[] = [
            {
                type: OrderType.MOVE,
                country: 'C2',
                origin: 'B',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            }
        ];

        const boardState = deriveInitialBoardStateFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false },
            B: { occupied: true },
            C: { occupied: false },
            D: { occupied: false },
            E: { occupied: false }
        };
        expect(boardState).to.eql(expectedState);
    });

    it('returns a map of the board, using two orders, showing territories as occupied or not', () => {
        const orders: Order[] = [
            {
                type: OrderType.MOVE,
                country: 'C2',
                origin: 'B',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            },
            {
                type: OrderType.SUPPORT_HOLD,
                country: 'C1',
                origin: 'D',
                target: 'B',
                unit: UnitType.ARMY,
                success: true
            }
        ];

        const boardState = deriveInitialBoardStateFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false },
            B: { occupied: true },
            C: { occupied: false },
            D: { occupied: true },
            E: { occupied: false }
        };
        expect(boardState).to.eql(expectedState);
    });

    describe('validateAbstractOrder()', () => {
        it('when the order is a move and is valid due to the target being a direct neighbor', () => {
            const order: MoveOrder = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'D',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(true);
        });
        it('when the order is a move and is not possible', () => {
            const order: MoveOrder = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'E',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(false);
        });

        it('when the order is a support hold and is valid', () => {
            const order: SupportHoldOrder = {
                type: OrderType.SUPPORT_HOLD,
                country: 'C1',
                origin: 'D',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(true);
        });
        it('when the order is a support hold and is not valid', () => {
            const order: SupportHoldOrder = {
                type: OrderType.SUPPORT_HOLD,
                country: 'C1',
                origin: 'D',
                target: 'A',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(false);
        });

        it('when the order is a supportMove and is valid', () => {
            const order: SupportMoveOrder = {
                type: OrderType.SUPPORT_MOVE,
                country: 'C1',
                origin: 'E',
                target: 'D',
                into: 'B',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(true);
        });
        it('when the order is a supportMove and is not valid', () => {
            const order: SupportMoveOrder = {
                type: OrderType.SUPPORT_MOVE,
                country: 'C1',
                origin: 'A',
                target: 'D',
                into: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validateAbstractOrder(order, territories)).to.equal(false);
        });
    });

    describe('hasNeighbor()', () => {
        it('when it is a valid neighbor', () => {
            const order = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'D',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(hasNeighbor(order.origin, order.target, territories)).to.equal(true);
        });
        it('when it is not a valid neighbor', () => {
            const order = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'B',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(hasNeighbor(order.origin, order.target, territories)).to.equal(false);
        });
    });

    describe('validMoveByConvoy', () => {
        it('finds that the convoy is possible for a sea route to a remote target.', () => {
            const order: MoveOrder = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'E',
                target: 'A',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validMoveByConvoy(order, territories)).to.equal(true);
        });
        it ('returns false for an impossible convoy route', () => {
            const order: MoveOrder = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'E',
                target: 'C',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validMoveByConvoy(order, territories)).to.equal(false);
        });
        it ('returns true for a move that is also possible without a convoy (adjacent target territory)', () => {
            const order: MoveOrder = {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'E',
                target: 'D',
                unit: UnitType.ARMY,
                success: true
            };
            expect(validMoveByConvoy(order, territories)).to.equal(true);
        });
    });
});
