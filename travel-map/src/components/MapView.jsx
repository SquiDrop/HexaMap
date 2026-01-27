import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function MapView() {
  const [departementsData, setDepartementsData] = useState(null);
  const [visitedDepartments, setVisitedDepartments] = useState(() => {
    const saved = localStorage.getItem("visitedDepartments");
    return saved ? JSON.parse(saved) : ["33"];
  });

  const [visitedPlaces, setVisitedPlaces] = useState(() => {
    const saved = localStorage.getItem("visitedPlaces");
    return saved
      ? JSON.parse(saved)
      : [
        { name: "ENSC", coords: [44.8153, -0.5742] },
      ];
  });

  useEffect(() => {
    localStorage.setItem(
      "visitedDepartments",
      JSON.stringify(visitedDepartments)
    );
  }, [visitedDepartments]);

  useEffect(() => {
    localStorage.setItem(
      "visitedPlaces",
      JSON.stringify(visitedPlaces)
    );
  }, [visitedPlaces]);



  useEffect(() => {
    fetch("/departements.geojson")
      .then((res) => res.json())
      .then((data) => setDepartementsData(data));
  }, []);

  const VISITED_STYLE = { fillColor: "#91ea94", fillOpacity: 0, borderOpacity: 1 };
  const UNVISITED_STYLE = { fillColor: "#ffffff", fillOpacity: 0.4, borderOpacity: 0.1 };

  const style = (feature) => {
    const isVisited = visitedDepartments.includes(feature.properties.code);
    const currentStyle = isVisited ? VISITED_STYLE : UNVISITED_STYLE;

    return {
      fillColor: currentStyle.fillColor,
      fillOpacity: currentStyle.fillOpacity,
      color: "#191919",
      opacity: currentStyle.borderOpacity,
      weight: 1
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const code = feature.properties.code;
        setVisitedDepartments((prev) =>
          prev.includes(code)
            ? prev.filter((c) => c !== code)
            : [...prev, code]
        );
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 3, color: "#2e1e69" });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({ weight: 1, color: "#191919" });
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const addPlace = (place) => {
    setVisitedPlaces((prev) => [...prev, place]);
  };

  const removePlace = (indexToRemove) => {
    const confirmDelete = window.confirm("Supprimer ce lieu ?");
    if (!confirmDelete) return;

    setVisitedPlaces((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  function MapClickHandler({ onAddPlace }) {
    useMapEvents({
      click(e) {
        // Vérifie l'état réel de Shift AU MOMENT du clic
        if (!e.originalEvent.shiftKey) return;

        const { lat, lng } = e.latlng;
        const name = prompt("Nom du lieu visité ?");
        if (!name) return;

        onAddPlace({
          name,
          coords: [lat, lng]
        });
      }
    });

    return null;
  }




  return (
    <MapContainer
      center={[46.6, 2.5]}
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler
        onAddPlace={addPlace}
      />

      {departementsData && (
        <GeoJSON
          key={JSON.stringify(visitedDepartments)}
          data={departementsData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}

      {visitedPlaces.map((place, idx) => (
        <Marker key={idx} position={place.coords}>
          <Popup>
            <strong>{place.name}</strong>
            <br />
            <button
              onClick={() => removePlace(idx)}
              style={{
                marginTop: "6px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
            >
              Supprimer
            </button>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default MapView;