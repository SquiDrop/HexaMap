import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function MapView() {
  const [departementsData, setDepartementsData] = useState(null);
  const [visitedDepartments, setVisitedDepartments] = useState(["33", "40", "47"]);
  const [visitedPlaces, setVisitedPlaces] = useState([
    { name: "Paris", coords: [48.8566, 2.3522] },
    { name: "Marseille", coords: [43.2965, 5.3698] },
    { name: "Lyon", coords: [45.7640, 4.8357] }
  ]);

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
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;