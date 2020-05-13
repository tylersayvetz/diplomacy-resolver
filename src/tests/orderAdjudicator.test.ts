const countries = ['C1', 'C2', 'C3', 'C4'];
import { TerritoryType, OrderType, UnitType } from '../const';
import { TerritoryDefinition, Order, MoveOrder } from '../types';
import { deriveContestedTerrritoriesFromOrders } from '../resolver';
import { expect } from 'chai';
// . +----------------------------------+-----+
// . |                                  |     |
// . |                          sea     |     |
//   +---------------+-----+     I      |     |
//   |       |       | sea |            |     |
//   |  A    |  B    |  E  |            |     |
//   |       |       |     |            |     |
//   |       |       |     |            |     |
//   +---------------+     |            |     |
//   |       |       |     |------+-----+ sea |
//   |  C    |  D    |     |  G   |  H  |  J  |
//   |       |       |     +------+     |     |
//   |       |       |     |      |     |     |
//   +---------------+-----+      |     | .   |
//   |                      sea   |     |     |
//   |                       F    +-----+     |
//   |                            |           |
//   +----------------------------+-----------+

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
 * Dummy data representing the territories.
 */
export const territories: TerritoryDefinition[] = [
    {
        name: 'A',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [
            { to: 'C', army: true, fleet: false },
            { to: 'B', army: true, fleet: false }
        ],
        coastalNeighbors: [{ to: 'I', army: false, fleet: true }]
    },
    {
        name: 'B',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [
            { to: 'A', army: true, fleet: false },
            { to: 'D', army: true, fleet: false }
        ],
        coastalNeighbors: [
            { to: 'E', army: false, fleet: true },
            { to: 'I', army: false, fleet: true }
        ]
    },
    {
        name: 'C',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [
            { to: 'A', army: true, fleet: false },
            { to: 'D', army: true, fleet: false }
        ],
        coastalNeighbors: [{ to: 'F', army: false, fleet: true }]
    },
    {
        name: 'D',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [
            { to: 'C', army: true, fleet: false },
            { to: 'B', fleet: false, army: true }
        ],
        coastalNeighbors: [
            { to: 'E', army: false, fleet: true },
            { to: 'F', army: false, fleet: true }
        ]
    },
    {
        name: 'E',
        type: TerritoryType.SEA,
        country: countries[0],
        neighbors: [
            { to: 'D', army: true, fleet: false },
            { to: 'B', army: true, fleet: false },
            { to: 'G', army: true, fleet: false }
        ],
        coastalNeighbors: [
            { to: 'I', army: false, fleet: true },
            { to: 'F', army: false, fleet: true }
        ]
    },
    {
        name: 'F',
        type: TerritoryType.SEA,
        country: countries[0],
        neighbors: [
            { to: 'C', army: true, fleet: false },
            { to: 'D', army: true, fleet: false },
            { to: 'G', army: true, fleet: false },
            { to: 'H', army: true, fleet: false }
        ],
        coastalNeighbors: [
            { to: 'E', army: false, fleet: true },
            { to: 'J', army: false, fleet: true }
        ]
    },
    {
        name: 'G',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [{ to: 'H', army: true, fleet: false }],
        coastalNeighbors: [
            { to: 'E', army: false, fleet: true },
            { to: 'I', army: false, fleet: true },
            { to: 'F', army: false, fleet: true },
            { to: 'J', army: false, fleet: true }
        ]
    },
    {
        name: 'H',
        type: TerritoryType.LAND,
        country: countries[0],
        neighbors: [{ to: 'G', army: true, fleet: false }],
        coastalNeighbors: [
            { to: 'F', army: false, fleet: true },
            { to: 'I', army: false, fleet: true },
            { to: 'J', army: false, fleet: true }
        ]
    },
    {
        name: 'I',
        type: TerritoryType.SEA,
        country: countries[0],
        neighbors: [
            { to: 'A', army: true, fleet: false },
            { to: 'B', army: true, fleet: false },
            { to: 'G', army: true, fleet: false },
            { to: 'H', army: true, fleet: false }
        ],

        coastalNeighbors: [
            { to: 'E', army: false, fleet: true },
            { to: 'J', army: false, fleet: true }
        ]
    },
    {
        name: 'J',
        type: TerritoryType.SEA,
        country: countries[0],
        neighbors: [{ to: 'H', army: true, fleet: false }],
        coastalNeighbors: [
            { to: 'F', army: false, fleet: true },
            { to: 'I', army: false, fleet: true }
        ]
    }
];

describe('returns a map of the board showing contested territories.', () => {
    it('when two countries are moving to the same territory...', () => {
        const orders: Order[] = [
            {
                type: OrderType.MOVE,
                country: 'C2',
                origin: 'B',
                target: 'D',
                unit: UnitType.ARMY
            },
            {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'C',
                target: 'D',
                unit: UnitType.ARMY
            }
        ];

        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false, contested: false },
            B: { occupied: true, contested: false },
            C: { occupied: true, contested: false },
            D: { occupied: false, contested: true },
            E: { occupied: false, contested: false },
            F: { occupied: false, contested: false },
            G: { occupied: false, contested: false },
            H: { occupied: false, contested: false },
            I: { occupied: false, contested: false },
            J: { occupied: false, contested: false }
        };
        expect(boardState).to.eql(expectedState);
    });
    it('when a country moves into a territory occupied by a holding country...', () => {
        const orders: Order[] = [
            { type: OrderType.HOLD, country: 'C2', origin: 'D', unit: UnitType.ARMY },
            {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'C',
                target: 'D',
                unit: UnitType.ARMY
            }
        ];

        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false, contested: false },
            B: { occupied: false, contested: false },
            C: { occupied: true, contested: false },
            D: { occupied: true, contested: true },
            E: { occupied: false, contested: false },
            F: { occupied: false, contested: false },
            G: { occupied: false, contested: false },
            H: { occupied: false, contested: false },
            I: { occupied: false, contested: false },
            J: { occupied: false, contested: false }
        };
        expect(boardState).to.eql(expectedState);
    });
    it('when a country moves into a territory occupied by it\'s own holding unit...', () => {
        const orders: Order[] = [
            { type: OrderType.HOLD, country: 'C1', origin: 'D', unit: UnitType.ARMY },
            {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'C',
                target: 'D',
                unit: UnitType.ARMY
            }
        ];

        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false, contested: false },
            B: { occupied: false, contested: false },
            C: { occupied: true, contested: false },
            D: { occupied: true, contested: true },
            E: { occupied: false, contested: false },
            F: { occupied: false, contested: false },
            G: { occupied: false, contested: false },
            H: { occupied: false, contested: false },
            I: { occupied: false, contested: false },
            J: { occupied: false, contested: false }
        };
        expect(boardState).to.eql(expectedState);
    });
    it('when a country moves into a territory that is support_holding another third territory...', () => {
        const orders: Order[] = [
            {
                type: OrderType.SUPPORT_HOLD,
                country: 'C2',
                origin: 'C',
                target: 'A',
                unit: UnitType.ARMY
            },
            {
                type: OrderType.MOVE,
                country: 'C1',
                origin: 'D',
                target: 'C',
                unit: UnitType.ARMY
            }
        ];

        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
            A: { occupied: false, contested: false },
            B: { occupied: false, contested: false },
            C: { occupied: true, contested: true },
            D: { occupied: true, contested: false },
            E: { occupied: false, contested: false },
            F: { occupied: false, contested: false },
            G: { occupied: false, contested: false },
            H: { occupied: false, contested: false },
            I: { occupied: false, contested: false },
            J: { occupied: false, contested: false }
        };
        expect(boardState).to.eql(expectedState);
    });

    xit ('**warning composite test** .  when a unit moves into a territory whose order was cancelled, it should be a conflict.  ', () => {
      //coding this will be......... hmm. This is a composit test !!! 
    });

    describe('resolveConflictedTerritory()', () => {
        describe('getRelativeWeight()', () => {
            it ('should return 1 if the order is unsupported MOVE', () => {
                const order: MoveOrder = {type: OrderType.MOVE, origin: 'A', target: 'B' }
                
            });
        })
    });
});