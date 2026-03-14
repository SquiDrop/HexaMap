import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";

import {
  createCustomIcon,
  getWorldStyle,
  getDepartmentStyle,
  getRegionStyle,
  getActiveRegions,
  REGIONS_META,
} from "../utils/mapUtils";
import { useVisitedPlaces } from "../hooks/useVisitedPlaces";
import MapClickHandler from "./MapClickHandler";
import StatsPanel from "./StatsPanel";
import CategoryManager from "./CategoryManager";
import PlaceModal from "./PlaceModal";

function MapView() {
  const [departementsData, setDepartementsData] = useState(null);
  const [regionsData, setRegionsData]           = useState(null);
  const [worldData, setWorldData]               = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [viewMode, setViewMode]                 = useState("departement"); // "departement" | "region"
  const [modal, setModal] = useState({ isOpen: false, coords: null, editIndex: null });

  const {
    visitedPlaces,
    categories,
    activeDepartments,
    addPlace,
    updatePlace,
    removePlace,
    addCategory,
    deleteCategory,
  } = useVisitedPlaces(departementsData);

  // Régions complètement visitées
  const activeRegions = useMemo(
    () => getActiveRegions(activeDepartments),
    [activeDepartments]
  );

  // Chargement GeoJSON
  useEffect(() => {
    fetch("/departements.geojson").then((r) => r.json()).then(setDepartementsData);
  }, []);

  useEffect(() => {
    fetch("/regions.geojson").then((r) => r.json()).then(setRegionsData);
  }, []);

  useEffect(() => {
    fetch("/world.geojson").then((r) => r.json()).then(setWorldData);
  }, []);

  // Gestion modal
  const openAddModal  = (lat, lng) => setModal({ isOpen: true, coords: [lat, lng], editIndex: null });
  const openEditModal = (index)    => setModal({ isOpen: true, coords: visitedPlaces[index].coords, editIndex: index });
  const closeModal    = ()         => setModal({ isOpen: false, coords: null, editIndex: null });

  const handleSave = (placeData, editIndex) => {
    const fullPlace = { ...placeData, coords: modal.coords };
    editIndex !== null ? updatePlace(editIndex, fullPlace) : addPlace(fullPlace);
    closeModal();
  };

  // ---------------------------------------------------------------------------
  // Styles et interactions — Départements
  // ---------------------------------------------------------------------------

  const departmentStyle = (feature) => getDepartmentStyle(feature, activeDepartments);

  const onEachDepartment = (feature, layer) => {
    layer.on({
      click:     (e) => openAddModal(e.latlng.lat, e.latlng.lng),
      mouseover: (e) => e.target.setStyle({ weight: 3, color: "#2e1e69" }),
      mouseout:  (e) => {
        const isVisited = activeDepartments.includes(feature.properties.code);
        e.target.setStyle({
          weight: 1,
          color: "#191919",
          opacity:     isVisited ? 1   : 0.4,
          fillOpacity: isVisited ? 0.2 : 0,
        });
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Styles et interactions — Régions
  // ---------------------------------------------------------------------------

  const regionStyle = (feature) => getRegionStyle(feature, activeRegions);

  const onEachRegion = (feature, layer) => {
    layer.on({
      click:     (e) => openAddModal(e.latlng.lat, e.latlng.lng),
      mouseover: (e) => e.target.setStyle({ weight: 3, color: "#2e1e69" }),
      mouseout:  (e) => {
        const isVisited = activeRegions.includes(feature.properties.code);
        e.target.setStyle({
          weight: 2,
          color: "#191919",
          opacity:     isVisited ? 1   : 0.6,
          fillOpacity: isVisited ? 0.2 : 0,
        });
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <StatsPanel
        visitedDeptCount={activeDepartments.length}
        totalDepartments={departementsData?.features.length ?? 0}
        visitedRegionCount={activeRegions.length}
        totalRegions={REGIONS_META.length}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((v) => v === "departement" ? "region" : "departement")}
        onToggleCategories={() => setShowCategoryManager((prev) => !prev)}
      />

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      <PlaceModal
        isOpen={modal.isOpen}
        editIndex={modal.editIndex}
        initialData={modal.editIndex !== null ? visitedPlaces[modal.editIndex] : null}
        categories={categories}
        onSave={handleSave}
        onClose={closeModal}
      />

      <MapContainer
        center={[46.6, 2.5]}
        zoom={6}
        minZoom={4}
        maxBounds={[[30, -15], [65, 25]]}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {worldData && (
          <GeoJSON data={worldData} style={getWorldStyle} interactive={false} />
        )}

        <MapClickHandler onMapClick={openAddModal} />

        {/* Couche départements */}
        {viewMode === "departement" && departementsData && (
          <GeoJSON
            key={"dept-" + activeDepartments.join(",")}
            data={departementsData}
            style={departmentStyle}
            onEachFeature={onEachDepartment}
          />
        )}

        {/* Couche régions */}
        {viewMode === "region" && regionsData && (
          <GeoJSON
            key={"region-" + activeRegions.join(",")}
            data={regionsData}
            style={regionStyle}
            onEachFeature={onEachRegion}
          />
        )}

        {/* Marqueurs — toujours visibles quel que soit le mode */}
        {visitedPlaces.map((place, idx) => (
          <Marker
            key={idx}
            position={place.coords}
            icon={createCustomIcon(place.category?.color || "#333")}
          >
            <Popup>
              <div style={{
                fontFamily: "Arial",
                textAlign: "center",
                minWidth: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}>
                <strong style={{ fontSize: "14px" }}>{place.name}</strong>
                <div style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: place.category?.color || "#eee",
                  color: "#f8ebeb",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}>
                  {place.category?.name || "Inconnu"}
                </div>
                <div style={{ fontSize: "13px", fontStyle: "italic", color: "#555", marginBottom: "10px" }}>
                  "{place.comment}"
                </div>
                <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  <button
                    onClick={() => openEditModal(idx)}
                    style={{ background: "#3498db", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => removePlace(idx)}
                    style={{ background: "#e74c3c", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default MapView;