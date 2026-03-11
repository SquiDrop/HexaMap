import { useMapEvents } from "react-leaflet";

/**
 * Composant invisible qui intercepte les clics sur la carte Leaflet.
 * Doit être défini HORS de MapView pour éviter les re-renders problématiques.
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default MapClickHandler;