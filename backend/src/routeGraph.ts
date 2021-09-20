import airportsData from "./data/airports.json";
import routesData from "./data/routes.json";

interface AirportData {
  "Airport ID": string;
  Name: string;
  City: string;
  Country: string;
  IATA: string;
  ICAO: string;
  Latitude: number;
  Longitude: number;
  Altitude: string;
  Timezone: string;
  DST: string;
  "Tz database time zone": string;
  Type: string;
  field14: string;
}

interface RouteData {
  Airline: string;
  "Airline ID": string;
  "Source airport": string;
  "Source airport ID": string;
  "Destination airport": string;
  "Destination airport ID": string;
  Codeshare: string;
  Stops: string;
  Equipment: string;
}

const routes: RouteData[] = routesData as RouteData[]; 
const airports: AirportData[] = airportsData as AirportData[];


export function findCode(code: string) {
  let airpotCode = "";
  if (code.length === 3) {
    airpotCode = "IATA";
  } else if (code.length === 4) {
    airpotCode = "ICAO";
  } else {
    return undefined;
  }

  const airport = airports.find((airport) => airport[airpotCode] === code);

  if (airport) {
    return airport.IATA;
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

class Airport {
  code: string;
  lat: number;
  lan: number;
  links: Link[] | null;
  constructor(code: string, lat: number, lan: number) {
    this.code = code;
    this.lat = lat;
    this.lan = lan;
    this.links = [];
  }
  link(airport: Airport) {
    if (airport === null) {
      this.links.push(null);
    } else {
      const distance = calculateDistance(
        this.lat,
        this.lan,
        airport.lat,
        airport.lan
      );
      this.links.push(new Link(this, airport, distance));
    }
  }
}

class Link {
  airportLeft: Airport;
  airportRight: Airport;
  distance: number;
  constructor(airportLeft: Airport, airportRight: Airport, distance: number) {
    this.airportLeft = airportLeft;
    this.airportRight = airportRight;
    this.distance = distance;
  }
}

export const generateRouteGraph = async (
  fromAirportIATA: string,
  toAirportIATA: string,
  leg = 0
) => {
  const fromAirport = airports.find(
    (airport) => airport.IATA === fromAirportIATA
  );
  const toAirport = airports.find((airport) => airport.IATA === toAirportIATA);

  // data seems to be missing some airports
  if (!fromAirport || !toAirport) {
    return false;
  }

  // define an airportNode
  const airportNode = new Airport(
    fromAirport.IATA,
    fromAirport.Latitude,
    fromAirport.Longitude
  );

  // find all possible destination for this airport
  const possibleDestinations = [
    ...new Set(
      routes.filter((route) => route["Source airport"] === airportNode.code)
    ),
  ];

  // find if there is a matchs
  const match = possibleDestinations.find(
    (route) => route["Destination airport"] === toAirportIATA
  );

  if (match) {
    const toAirport = airports.find(
      (airport) => airport.IATA === toAirportIATA
    )!;
    airportNode.link(
      new Airport(toAirport.IATA, toAirport.Latitude, toAirport.Longitude)
    );
  } else {
    if (leg < 4) {
      for (const destination of possibleDestinations) {
        const routeGraph = await generateRouteGraph(
          destination["Destination airport"],
          toAirportIATA,
          ++leg
        );
        if (routeGraph) {
          airportNode.link(routeGraph);
        }
      }
    }
  }

  return airportNode;
};
