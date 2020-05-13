// NEW JAVSCRIPT!;
var stage = 'NEEDS_ORDERS';
var orders = {
    Turkey: { Con: { type: 'HOLD' }, Smy: { type: 'HOLD' }, Ank: { type: 'HOLD' } },
    Italy: { Ven: { type: 'HOLD' }, Nap: { type: 'HOLD' }, Rom: { type: 'HOLD' } },
    France: { Par: { type: 'HOLD' }, Mar: { type: 'HOLD' }, Bre: { type: 'HOLD' } },
    Austria: { Tri: { type: 'HOLD' }, Bud: { type: 'HOLD' }, Vie: { type: 'HOLD' } },
    Germany: { Ber: { type: 'HOLD' }, Mun: { type: 'HOLD' }, Kie: { to: 'Den', type: 'MOVE' } },
    England: { Edi: { type: 'HOLD' }, Lon: { type: 'HOLD' }, Lvp: { type: 'HOLD' } },
    Russia: {
        Mos: { type: 'HOLD' },
        Sev: { type: 'HOLD' },
        Stp: { type: 'HOLD' },
        War: { type: 'HOLD' }
    }
};
var unitsByPlayer = {
    Austria: { Bud: 'A', Tri: 'F', Vie: 'A' },
    England: { Edi: 'F', Lon: 'F', Lvp: 'A' },
    France: { Bre: 'F', Mar: 'A', Par: 'A' },
    Germany: { Ber: 'A', Kie: 'F', Mun: 'A' },
    Italy: { Nap: 'F', Rom: 'A', Ven: 'A' },
    Russia: { Mos: 'A', Sev: 'F', Stp: { type: 'F', coast: 'sc' }, War: 'A' },
    Turkey: { Ank: 'F', Con: 'A', Smy: 'A' }
};
var territories = {
    Par: 'France',
    Smy: 'Turkey',
    Lon: 'England',
    Nap: 'Italy',
    Ven: 'Italy',
    Mun: 'Germany',
    War: 'Russia',
    Mar: 'France',
    Mos: 'Russia',
    Bud: 'Austria',
    Tri: 'Austria',
    Lvp: 'England',
    Stp: 'Russia',
    Ber: 'Germany',
    Con: 'Turkey',
    Sev: 'Russia',
    Rom: 'Italy',
    Vie: 'Austria',
    Edi: 'England',
    Ank: 'Turkey',
    Kie: 'Germany',
    Bre: 'France'
};
var mapSize = 'large';
var activePlayer = null;
var unitChangeCount = {};
var buildableTerritories = [];
var unbuildableTerritories = [];
var retreatOptions = {};
var playerRetreatOrders = {}; // not sure this is used
var disable_engine = false;
var base_url = '/sandbox/6118763419664384';
var session_id = 'NVYE10WV6ERCQFFXCTG0T8H3QP4IGA859JB8LGX2PEEY8Q6S9Q26LHVW0LPCN0S';

////////////////////////////////////////////////////////////////////////////////////////////////////////////

var stage = 'NEEDS_ORDERS';
var orders = {};

//this is where units are on the board.
var unitsByPlayer = {
    Austria: { Gal: 'A', Tri: 'F', Vie: 'A' },
    England: { Edi: 'F', Lon: 'F', Lvp: 'A' },
    France: { Bre: 'F', Mar: 'A', Par: 'A' },
    Germany: { Ber: 'A', Den: 'F', Mun: 'A' },
    Italy: { Nap: 'F', Rom: 'A', Ven: 'A' },
    Russia: { Mos: 'A', Sev: 'F', Stp: { type: 'F', coast: 'sc' }, War: 'A' },
    Turkey: { Ank: 'F', Con: 'A', Smy: 'A' }
};

//this is the ownership.
//anything not listed here is 'neutral'
var territories = {
    Par: 'France',
    Smy: 'Turkey',
    Lon: 'England',
    Nap: 'Italy',
    Ven: 'Italy',
    Mun: 'Germany',
    War: 'Russia',
    Mar: 'France',
    Mos: 'Russia',
    Bud: 'Austria',
    Tri: 'Austria',
    Lvp: 'England',
    Stp: 'Russia',
    Ber: 'Germany',
    Con: 'Turkey',
    Sev: 'Russia',
    Rom: 'Italy',
    Vie: 'Austria',
    Edi: 'England',
    Ank: 'Turkey',
    Kie: 'Germany',
    Bre: 'France'
};
var mapSize = 'large';
var activePlayer = null;
var unitChangeCount = {};
var buildableTerritories = [];
var unbuildableTerritories = [];
var retreatOptions = {};
var playerRetreatOrders = {}; // not sure this is used
var disable_engine = false;
var base_url = '/sandbox/6118763419664384';
var session_id = 'NVYE10WV6ERCQFFXCTG0T8H3QP4IGA859JB8LGX2PEEY8Q6S9Q26LHVW0LPCN0S';
