import MapView from "./components/MapView";
import LandingPage from "./components/LandingPage";
import { useState } from "react";

function App() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      {!showMap ? (
        <LandingPage onStart={() => setShowMap(true)} />
      ) : (
        <MapView onBack={() => setShowMap(false)} />
      )}
    </>
  );
}

export default App;
