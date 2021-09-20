import React, { useState } from "react";
import "./App.css";
import FlightRoute from "./FlightRoute";

interface InputValues {
  [key: string]: string;
}

interface FlighData {
  fastestRoute: Route[];
  allRoutes: Route[][];
}
interface Route {
  airportIATA: string;
  distance: number;
  accumulatedDistance: number;
  next: null;
}

function App() {
  const [values, setValues] = useState<InputValues>({
    airportTo: "",
    airportFrom: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FlighData>();

  const change = (partial: InputValues) => {
    setValues((values) => ({
      ...values,
      ...partial,
    }));
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    change({ [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSearchClick = async () => {
    setLoading(true);
    try {
      const rawResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAirport: values.airportFrom,
          toAirport: values.airportTo,
        }),
      });
      const content = (await rawResponse.json()) as FlighData;

      setLoading(false);
      setResults(content);
    } catch (e) {
      setLoading(false);

      console.log(e);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>flight planner</h1>
      </header>
      <main className="main">
        <input
          className="input-element"
          value={values.airportFrom}
          name="airportFrom"
          onChange={handleChange}
          type="text"
          placeholder="Airport from"
          disabled={loading}
        />
        <input
          className="input-element"
          value={values.airportTo}
          name="airportTo"
          onChange={handleChange}
          type="text"
          placeholder="Airport to"
          disabled={loading}
        />
        <button
          className="button-element"
          type="button"
          onClick={handleSearchClick}
          disabled={loading}
        >
          {loading ? "Loading" : "Search"}
        </button>
      </main>
      {results?.fastestRoute.length ? (
        <FlightRoute routeData={results.fastestRoute} />
      ) : null}
    </div>
  );
}

export default App;
