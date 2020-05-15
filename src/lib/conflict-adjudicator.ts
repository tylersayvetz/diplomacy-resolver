

import { Order, TerritoryDefinition, TerritoryStatus, OrderStatus, Contestant } from "../types";
import { OrderType } from "../const";

export interface BoardState {
    [territoryName: string]: TerritoryStatus
}

//build the board state from the orders.
export function buildTerritoryStatusesFromOrders(orders: Order[], territoryDefinitions: TerritoryDefinition[]): BoardState  {

    const boardState: BoardState = {}

    for (const territoryDefinition of territoryDefinitions) {
        boardState[territoryDefinition.name] = {
            territory: territoryDefinition,
            contested: false,
            contestants: null,
            occupant: null
        };
    }

    const orderStatuses = orders.map<OrderStatus>(order => ({
        order,
        resolution: null,
        convoyRoutes: null,
        supports: []
    }))

    //mapping all of the required properties' values on to the boardSTate.
    for (const orderStatus of orderStatuses) {
        const orderTerritory = orderStatus.order.origin;

        
        //set contestants information.
        const contestants = orders
            .filter(order => order.type === OrderType.MOVE && order.target === orderTerritory)
            .map<Contestant>(order => ({
                // FIXME: handle convoy routes.
                convoyRoutes: null,
                territory: boardState[order.origin]
            }))

        //
        const supports = orders.filter(order => {
            //TODO: the next thing I was going to do was....
            // find all the support moves that affect this orderStatus
        })
        
        //set the information. 
        boardState[orderTerritory].occupant = orderStatus;
        boardState[orderTerritory].contestants = contestants.length > 0 ? contestants : null;

    }

    return boardState
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
            convoyRoutes?: <Territory[][] | null>
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