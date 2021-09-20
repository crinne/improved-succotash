import React from "react";
import "./Link.css";

interface Route {
  airportIATA: string;
  distance: number;
  accumulatedDistance: number;
  next: null;
}

interface Props {
  data: Route[];
}

const Link = React.memo(({ data }: Props) => {
  const routes = data.map((route, index, arr) => {
    return (
      <li className="link" key={index}>
        {route.airportIATA} {"> "}{" "}
        {index === 0 ? "" : Math.floor(route.distance) + " km"}
        {arr.length - 1 === index ? " = " + Math.floor(route.accumulatedDistance) + " km" : ''}
      </li>
    );
  });

  return <>{routes}</>;
});

export default Link;
