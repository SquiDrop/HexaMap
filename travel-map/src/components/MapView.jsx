import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";

import {
  createCustomIcon,
  getWorldStyle,
  getDepartmentStyle,
  getRegionStyle,
  getActiveRegions,
  REGIONS_META,
} from "../utils/mapUtils";
import { playDeptUnlock } from "../utils/sounds";
import { useVisitedPlaces } from "../hooks/useVisitedPlaces";
import { useBadges } from "../hooks/useBadges";
import MapClickHandler from "./MapClickHandler";
import StatsPanel from "./StatsPanel";
import CategoryManager from "./CategoryManager";
import PlaceModal from "./PlaceModal";
import ObjectivesPanel from "./ObjectivesPanel";
import StatsDrawer from "./StatsDrawer";
import BadgeToast from "./BadgeToast";

function MapView({ onBack }) {
  const [departementsData, setDepartementsData] = useState(null);
  const [regionsData, setRegionsData] = useState(null);
  const [worldData, setWorldData] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState("departement");
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

  const activeRegions = useMemo(
    () => getActiveRegions(activeDepartments),
    [activeDepartments]
  );

  const { newBadges, dismissBadge } = useBadges({ activeDepartments, activeRegions, visitedPlaces, departementsLoaded: departementsData !== null });

  // displayedDepartments suit activeDepartments avec 1s de délai —
  // permet à la modal de se fermer avant que le département se colorie.
  // Le chargement initial (GeoJSON) est instantané pour ne pas avoir un délai au démarrage.
  const [displayedDepartments, setDisplayedDepartments] = useState([]);
  const deptInitializedRef = useRef(false);
  useEffect(() => {
    if (!departementsData) return;
    if (!deptInitializedRef.current) {
      deptInitializedRef.current = true;
      setDisplayedDepartments(activeDepartments);
      return;
    }
    const timer = setTimeout(() => setDisplayedDepartments(activeDepartments), 1000);
    return () => clearTimeout(timer);
  }, [activeDepartments, departementsData]);

  // Son avec le même délai d'1s
  const prevDeptCountRef = useRef(null);
  useEffect(() => {
    if (!departementsData) return;
    if (prevDeptCountRef.current === null) {
      prevDeptCountRef.current = activeDepartments.length;
      return;
    }
    if (activeDepartments.length > prevDeptCountRef.current)
      setTimeout(() => playDeptUnlock(), 1000);
    prevDeptCountRef.current = activeDepartments.length;
  }, [activeDepartments.length, departementsData]);

  useEffect(() => {
    fetch("/departements.geojson").then(r => r.json()).then(setDepartementsData);
  }, []);
  useEffect(() => {
    fetch("/regions.geojson").then(r => r.json()).then(setRegionsData);
  }, []);
  useEffect(() => {
    fetch("/world.geojson").then(r => r.json()).then(setWorldData);
  }, []);

  const openAddModal = (lat, lng) => setModal({ isOpen: true, coords: [lat, lng], editIndex: null });
  const openEditModal = (index) => setModal({ isOpen: true, coords: visitedPlaces[index].coords, editIndex: index });
  const closeModal = () => setModal({ isOpen: false, coords: null, editIndex: null });

  const handleSave = (placeData, editIndex) => {
    const fullPlace = { ...placeData, coords: modal.coords };
    editIndex !== null ? updatePlace(editIndex, fullPlace) : addPlace(fullPlace);
    closeModal();
  };

  const departmentStyle = (feature) => getDepartmentStyle(feature, displayedDepartments);

  const onEachDepartment = (feature, layer) => {
    const { code, nom } = feature.properties;
    let tooltipTimer = null;

    layer.bindTooltip(
      `<div style="font-family:Arial;font-size:13px;text-align:center;padding:2px 4px">
        <strong>${nom}</strong><br/>
        <span style="color:#888;font-size:11px">Dép. ${code}</span>
      </div>`,
      { sticky: false, opacity: 0.95, className: "hexamap-tooltip" }
    );

    layer.on({
      click: (e) => openAddModal(e.latlng.lat, e.latlng.lng),

      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: "#2e1e69" });
        // tooltip affiché seulement après 3s de hover, pas immédiatement
        tooltipTimer = setTimeout(() => {
          layer.openTooltip(e.latlng);
        }, 3000);
      },

      mousemove: () => {
        clearTimeout(tooltipTimer);
        layer.closeTooltip();
        tooltipTimer = setTimeout(() => {
          layer.openTooltip();
        }, 3000);
      },

      mouseout: (e) => {
        clearTimeout(tooltipTimer);
        layer.closeTooltip();
        const isVisited = displayedDepartments.includes(code);
        e.target.setStyle({
          weight: 1, color: "#191919",
          opacity: isVisited ? 1 : 0.4,
          fillOpacity: isVisited ? 0.2 : 0,
        });
      },
    });
  };

  const regionStyle = (feature) => getRegionStyle(feature, activeRegions);

  const onEachRegion = (feature, layer) => {
    const { code, nom } = feature.properties;
    let tooltipTimer = null;

    layer.bindTooltip(
      `<div style="font-family:Arial;font-size:13px;text-align:center;padding:2px 4px">
        <strong>${nom}</strong>
      </div>`,
      { sticky: false, opacity: 0.95, className: "hexamap-tooltip" }
    );

    layer.on({
      click: (e) => openAddModal(e.latlng.lat, e.latlng.lng),

      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: "#2e1e69" });
        tooltipTimer = setTimeout(() => {
          layer.openTooltip(e.latlng);
        }, 3000);
      },

      mousemove: () => {
        clearTimeout(tooltipTimer);
        layer.closeTooltip();
        tooltipTimer = setTimeout(() => {
          layer.openTooltip();
        }, 3000);
      },

      mouseout: (e) => {
        clearTimeout(tooltipTimer);
        layer.closeTooltip();
        const isVisited = activeRegions.includes(code);
        e.target.setStyle({
          weight: 2, color: "#191919",
          opacity: isVisited ? 1 : 0.6,
          fillOpacity: isVisited ? 0.2 : 0,
        });
      },
    });
  };

  return (
    <>
      <BadgeToast badges={newBadges} onDismiss={dismissBadge} />

      {/* Titre centré */}
      <div style={{
        position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
        zIndex: 1000, pointerEvents: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "22px", fontWeight: 900, letterSpacing: "3px",
        color: "#e63946",
        textShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}>
        HEXAMAP
      </div>

      {/* Bouton retour */}
      <button
        onClick={onBack}
        title="Retour à l'accueil"
        style={{
          position: "absolute", top: "90px", left: "12px", zIndex: 1000,
          background: "white", border: "none", borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer", padding: "8px 12px",
          fontSize: "18px", lineHeight: 1,
        }}
      >
        ←
      </button>

      <StatsPanel
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === "departement" ? "region" : "departement")}
        onToggleCategories={() => setShowCategoryManager(prev => !prev)}
        onToggleObjectives={() => setShowObjectives(prev => !prev)}
        showObjectives={showObjectives}
        onToggleStats={() => setShowStats(prev => !prev)}
        showStats={showStats}
      />

      {showStats && (
        <StatsDrawer
          onClose={() => setShowStats(false)}
          visitedPlaces={visitedPlaces}
          activeDepartments={activeDepartments}
          activeRegions={activeRegions}
          totalDepartments={departementsData?.features.length ?? 96}
          totalRegions={REGIONS_META.length}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {showObjectives && (
        <ObjectivesPanel
          onClose={() => setShowObjectives(false)}
          activeDepartments={activeDepartments}
          activeRegions={activeRegions}
          visitedPlaces={visitedPlaces}
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
        key="free"
        center={[46.6, 2.5]}
        zoom={6}
        //minZoom={4}
        //maxBounds={[[30, -15], [65, 25]]}
        //maxBoundsViscosity={1.0}
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

        {viewMode === "departement" && departementsData && (
          <GeoJSON
            key={"dept-" + displayedDepartments.join(",")}
            data={departementsData}
            style={departmentStyle}
            onEachFeature={onEachDepartment}
          />
        )}

        {viewMode === "region" && regionsData && (
          <GeoJSON
            key={"region-" + activeRegions.join(",")}
            data={regionsData}
            style={regionStyle}
            onEachFeature={onEachRegion}
          />
        )}

        {visitedPlaces.map((place, idx) => (
          <Marker
            key={idx}
            position={place.coords}
            icon={createCustomIcon(place.category?.color || "#333")}
          >
            <Popup minWidth={200} maxWidth={280}>
              <div style={{
                fontFamily: "Arial",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                textAlign: "center",
              }}>
                {/* Photo si disponible */}
                {place.photo && (
                  <div style={{
                    width: "100%",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "2px",
                  }}>
                    <img
                      src={place.photo}
                      alt={place.name}
                      style={{
                        width: "100%",
                        maxHeight: "220px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                <strong style={{ fontSize: "14px" }}>{place.name}</strong>

                {/* Badge catégorie */}
                <div style={{
                  display: "inline-block", padding: "2px 8px", borderRadius: "12px",
                  background: place.category?.color || "#eee",
                  color: "#f8ebeb", fontSize: "11px", fontWeight: "bold",
                }}>
                  {place.category?.name || "Inconnu"}
                </div>

                {/* Date */}
                {(place.date?.season || place.date?.year) && (
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    🗓 {[place.date.season, place.date.year].filter(Boolean).join(" ")}
                  </div>
                )}

                {/* Commentaire */}
                {place.comment && (
                  <div style={{ fontSize: "13px", fontStyle: "italic", color: "#555" }}>
                    "{place.comment}"
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "5px", marginTop: "4px" }}>
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