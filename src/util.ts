import { Order, TerritoryDefinition } from "./types";
import { OrderType } from "./const";

export function isTargettingTerritory (order: Order, territory: TerritoryDefinition): boolean {

    //is holding and therefor intends to occupy the territory
    const holding = order.type === OrderType.HOLD || order.type === OrderType.SUPPORT_HOLD;
    //is targetting the territory aggressively
    const targetting = order.type === OrderType.MOVE && order.target === territory.name
    //is targetting the territory in a supporting manner
    const supporting = order.type === OrderType.SUPPORT_MOVE && order.target === territory.name

    return holding || targetting || supporting
}

//assigns a HOLD order to any unit who was not assigned an order by the player.
export function assignHoldOrderToNoOp(): void {
    //might not need this. Depeneding on data structure decisions with the boardStatus. 
}