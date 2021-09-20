import React from "react";
import "./FlightRoute.css";
import Link from "./Link";

interface Route {
  airportIATA: string;
  distance: number;
  accumulatedDistance: number;
  next: null;
}

interface Props {
  routeData: Route[];
}

const FlightRoute = ({ routeData }: Props) => {
  return (
    <div className="wrapper">
      <div className="link">
        <Link data={routeData} />
      </div>
    </div>
  );
};

export default FlightRoute;
