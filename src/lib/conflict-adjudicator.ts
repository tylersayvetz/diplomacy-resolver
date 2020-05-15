import { Order, TerritoryDefinition, TerritoryStatus, OrderStatus, Contestant, ConvoyRoute, ConvoyOrder, MoveOrder } from '../types';
import { OrderType } from '../const';
import { territoryIsContested, getDefinitionsFromNeighbors } from './util';
import { validMoveByConvoy } from './order-validators';
import { territories } from '../tests/orderAdjudicator.test';

export interface BoardState {
    [territoryName: string]: TerritoryStatus;
}

//build the board state from the orders.
export function buildTerritoryStatusesFromOrders(orders: Order[], territoryDefinitions: TerritoryDefinition[]): BoardState {
    const boardState: BoardState = {};

    //things to do for every territory.
    for (const territoryDefinition of territoryDefinitions) {
        //1. determine contested status
        const contested = territoryIsContested(territoryDefinition, orders) ? true : false;

        //2. determine the contestants
        const contestants = orders
            .filter((order) => order.type === OrderType.MOVE && order.target === territoryDefinition.name)
            .map<Contestant>((order) => ({
                // FIXME: handle convoy routes.
                convoyRoutes: null,
                territory: boardState[order.origin]
            }));

        boardState[territoryDefinition.name] = {
            territory: territoryDefinition,
            contested,
            contestants: contested ? contestants : null,
            occupant: null
        };
    }

    //things to do for every order.
    //create an orderStatus for every Order.
    const orderStatuses = orders.map<OrderStatus>((order) => ({
        order,
        resolution: null,
        convoyRoutes: null,
        supports: []
    }));

    //things to do for every OrderStatus
    for (const orderStatus of orderStatuses) {
        //1. map this orderStatus to 'occupant' on the boardState.
        //2. find supports to this order.
        //3. if the type is a convoy, find all of the convoy routes to the target

        const orderTerritory = orderStatus.order.origin;
        boardState[orderTerritory].occupant = orderStatus;

        //get all supports
        const supports = orders
            .filter((order) => {
                const isSupportingCurrentTerritory =
                    (order.type === OrderType.SUPPORT_HOLD || order.type === OrderType.SUPPORT_MOVE) &&
                    order.target === orderTerritory;

                return isSupportingCurrentTerritory;
            })
            .map((order) => {
                return boardState[order.origin];
            });

        orderStatus.supports = supports;

        //find all convoy routes.
        if (orderStatus.order.type === OrderType.MOVE && validMoveByConvoy(orderStatus.order, territories)) {

            orderStatus.convoyRoutes = findConvoyRoutes(orderStatus.order, territories, boardState);
        }
    }

    return boardState;
}


export function findConvoyRoutes(order: MoveOrder, territories: TerritoryDefinition[], boardState: BoardState): ConvoyRoute[] | null {

    const target = order.target;
    const home = territories.find(t => t.name == order.origin);
    const coastalNeighbors = home.coastalNeighbors;

    if (coastalNeighbors === null) return null

    const coastalNeighborDefinitions = getDefinitionsFromNeighbors(coastalNeighbors);
    const convoyRoutes: ConvoyRoute[] = [];

    for (const neighbor of coastalNeighborDefinitions) {
        const possible = dfsConvoyRoutes(home, neighbor, target);
        if (possible) {

            //create a territoryStatus array and push it to the convoyRoutes array.
        }
    }

    return convoyRoutes;
}

export function dfsConvoyRoutes (home: TerritoryDefinition, current: TerritoryDefinition | null, goal: string, route: TerritoryDefinition[] = []): TerritoryDefinition[] | void {
    //base cases. if the current is the goal OR if there are no coastal neighbors, return current.
    if (current.name === goal || !current.coastalNeighbors) return;

    const coastalNeighbors = getDefinitionsFromNeighbors(current.coastalNeighbors)  
        .filter(territory => {
            return true //FIXME return type is 'convoy' AND target is 'home' AND into is 'goal'.
        });
    //get all the neighbors and DFS them.
    for (const neighbor of coastalNeighbors) {
        console.log('In DFS', neighbor.name);
        //FIXME inifinite recursion. uf. needs help
        //TODO: What I was about to do was: 
        //finish this search of the territories for valid convoy routes. 
        
        dfsConvoyRoutes(home, neighbor, goal, route)
    }
}

/*
    psuedo code: 

    todo: two territories cannot exchange places. unless one or both are convoyed.
    todo: dont allow dislodgement of self or support of dislodgement of self.. --resolver.


 
    while(contestedTerritories.length) (
        cut supports in territories that are being 
            a. attacked by adjacent territory OR
            b. attacked by convoyed army who has a convoy route that is uncontested.

        for each contested territory (A) (
            if A is a MOVE order follow the move chain downstream {
                set current = a.next
                while current.type == move && is unresolved.
                    todo: deal with convoy routes.
                    current = current.next
                    break out of the conflict.
            }

            for each first degree contestant (B) (

                if ANY of the B's supports are contested, break out of conflict.
                if ALL of the B's convoy routes are contested, break out of the conflict. 
                    UNLESS the contestant to the convoyer (C) is being supported by A
            )

            resolve it and remove from contested list. 
        )
    )

   Territories: {
       [territoryName: string]: <Territory>
   }

   Territory: {
        name: <string>,
        contested: <boolean>,
        contestants:  {
            convoyRoutes: <Territory[][] | null>
            territory: <Territory> 
        }[]
        occupant: {
            order: <Order> ,
            resolution: <boolean | null>,
            convoyRoutes?: <Territory[][] | null> note: present if order.type is move_via_convoy
            supports: <Territory[]>| null>,
        } | null
   }


//    OrderStatus {
//         order: <Order> ,
//         resolution: <boolean | null>,
//         convoyRoutes?: <Territory[][] | null> note: present if order.type is move_via_convoy
//         supports: <Territory[]>
//    }

*/
