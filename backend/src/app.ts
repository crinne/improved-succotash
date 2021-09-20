import express from "express";
import cors from "cors";
import { generateRouteGraph, findCode } from "./routeGraph";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/search", async (req, res) => {
  const { fromAirport, toAirport } = req.body;

  const fromAirportIATA = findCode(fromAirport);
  const toAirportIATA = findCode(toAirport);

  const routeGraph = await generateRouteGraph(fromAirportIATA, toAirportIATA);

  if (!routeGraph) {
    return res.send({ fastestRoute: [], allRoutes: [] });
  }

  let currentDistance = 99999999;
  let fastestRoute = {};


  function normaliseTree(tree, arr = []) {
    arr.push({ ...tree, next: null });
    if (tree.next) {
      normaliseTree(tree.next, arr);
    }
    return arr;
  }

  function findAllRoutes(
    airport,
    distance = 0,
    previousDistance = 0,
    pre = null,
    arr = []
  ) {
    const parent = {
      airportIATA: airport.code,
      distance: distance,
      accumulatedDistance: previousDistance,
      next: pre,
    };
    if (airport.links.length) {
      for (const { airportRight, distance } of airport.links) {
        findAllRoutes(
          airportRight,
          distance,
          previousDistance + distance,
          parent,
          arr
        );
      }
    } else {
      if (airport.code === toAirportIATA) {
        if (currentDistance > previousDistance) {
          currentDistance = previousDistance;
          fastestRoute = parent;
        }
        arr.push(parent);
      }
    }
    return arr;
  }

  const allResults = findAllRoutes(routeGraph);
  const normalizedFastestRoute = normaliseTree(fastestRoute).reverse();
  const normalizedAllRoutes = allResults.map((result) =>
    normaliseTree(result).reverse()
  );

  res.send({
    fastestRoute: normalizedFastestRoute,
    allRoutes: normalizedAllRoutes,
  });
});

export { app };
