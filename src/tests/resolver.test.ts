const countries = ['C1', 'C2', 'C3', 'C4'];
import { TerritoryType, OrderType } from '../const';
import { TerritoryDefinition, Order } from '../types';
import { deriveInitialBoardStateFromOrders, deriveContestedTerrritoriesFromOrders } from '../resolver';
import { expect } from 'chai';

//   +---------------+
//   |       |       |
//   |  A    |  B    | . <-- name of territory
//   |       |  C2   | . <--occupying power
//   |       |       |
//   +---------------+
//   |       |       |
//   |  C    |  D    |
//   |       |       |
//   |       |       |
//   +---------------+

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

export const territories: TerritoryDefinition[] = [
  {
    name: 'A',
    type: TerritoryType.LAND,
    country: countries[0],
    neighbors: [
      { to: 'B', army: true, fleet: false },
      { to: 'C', army: true, fleet: false }
    ],
    coastalNeighbors: null
  },
  {
    name: 'B',
    type: TerritoryType.LAND,
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
    neighbors: [
      { to: 'B', army: true, fleet: false },
      { to: 'C', army: true, fleet: false }
    ],
    coastalNeighbors: null
  }
];

/**
 * MOVE
 * territory: ORIGIN
 * territory_secondary: TARGET
 * territory_tertiary: null
 */

describe('maps initial board state', () => {
    
  it('returns a map of the board, showing territories as occupied or not', () => {

    const orders: Order[] = [{ type: OrderType.MOVE, country: 'C2', origin: 'B', target: 'C' }];

    const boardState = deriveInitialBoardStateFromOrders(orders, territories);
    const expectedState = {
      A: { occupied: false },
      B: { occupied: true },
      C: { occupied: false },
      D: { occupied: false }
    };
    expect(boardState).to.eql(expectedState);
    
  });

  it('returns a map of the board, using two orders, showing territories as occupied or not', () => {

    const orders: Order[] = [
        { type: OrderType.MOVE, country: 'C2', origin: 'B', target: 'C' },
        { type: OrderType.SUPPORT_HOLD, country: 'C1', origin: 'D', target: 'B' }
    ];

    const boardState = deriveInitialBoardStateFromOrders(orders, territories);
    const expectedState = {
      A: { occupied: false },
      B: { occupied: true },
      C: { occupied: false },
      D: { occupied: true }
    };
    expect(boardState).to.eql(expectedState);
  });

  describe('returns a map of the board showing contested territories.', () => {
      it ('when two countries are moving to the same territory...', () => {
        const orders: Order[] = [
            { type: OrderType.MOVE, country: 'C2', origin: 'B', target: 'D' },
            { type: OrderType.MOVE, country: 'C1', origin: 'C', target: 'D' }
        ];
    
        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
          A: { occupied: false, contested: false },
          B: { occupied: true, contested: false },
          C: { occupied: true, contested: false },
          D: { occupied: false, contested: true }
        };
        expect(boardState).to.eql(expectedState); 
      });
      it ('when a country moves into a territory occupied by a holding country...', () => {
        const orders: Order[] = [
            { type: OrderType.HOLD, country: 'C2', origin: 'D' },
            { type: OrderType.MOVE, country: 'C1', origin: 'C', target: 'D' }
        ];
    
        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
          A: { occupied: false, contested: false },
          B: { occupied: false, contested: false },
          C: { occupied: true, contested: false },
          D: { occupied: true, contested: true }
        };
        expect(boardState).to.eql(expectedState); 
      });
      it ('when a country moves into a territory that is support_holding another third territory...', () => {
        const orders: Order[] = [
            { type: OrderType.SUPPORT_HOLD, country: 'C2', origin: 'C', target: 'A' },
            { type: OrderType.MOVE, country: 'C1', origin: 'D', target: 'C' }
        ];
    
        const boardState = deriveContestedTerrritoriesFromOrders(orders, territories);
        const expectedState = {
          A: { occupied: false, contested: false },
          B: { occupied: false, contested: false },
          C: { occupied: true, contested: true },
          D: { occupied: true, contested: false }
        };
        expect(boardState).to.eql(expectedState); 
      });
  });

});