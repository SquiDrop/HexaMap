import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import { useEffect, useState, useMemo } from "react"; // Ajout de useMemo pour la perf
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

// --- ICONES ---
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

function MapView() {
  const [departementsData, setDepartementsData] = useState(null);

  // --- STATES DONNÉES ---
  // On ne stocke plus 'visitedDepartments'. C'est calculé automatiquement.

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("tripCategories");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Vacances Famille", color: "#27ae60" },
      { id: 2, name: "Week-end Potes", color: "#e74c3c" },
      { id: 3, name: "Solo / Boulot", color: "#2980b9" }
    ];
  });

  const [visitedPlaces, setVisitedPlaces] = useState(() => {
    const saved = localStorage.getItem("visitedPlaces");
    return saved
      ? JSON.parse(saved)
      : [
        {
          name: "ENSC",
          coords: [44.8153, -0.5742],
          comment: "L'école !",
          category: { name: "Solo / Boulot", color: "#2980b9" }
        },
      ];
  });

  // --- STATES UI ---
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newPlaceModal, setNewPlaceModal] = useState({ isOpen: false, coords: null, editIndex: null });

  //Europe
  const [worldData, setWorldData] = useState(null);
  const isEuropeanCountry = (feature) => {
  const europeCountries = [
    "Spain","Portugal","Italy","Belgium","Netherlands","Germany",
    "Switzerland","Austria","United Kingdom","Ireland","Luxembourg",
    "Denmark","Poland","Czechia","Slovakia","Hungary","Slovenia",
    "Croatia","Bosnia and Herz.","Serbia","Montenegro","Albania",
    "Greece","Bulgaria","Romania","Norway","Sweden","Finland", 
    "Czech Republic", "Bosnia and Herzegovina", "Kosovo", "Republic of Serbia",
    "Macedonia", "Morocco", "Algeria", "Libya", "Tunisia", "Russia"
  ];

  return europeCountries.includes(feature.properties.name);
};


  // Formulaire
  const [formName, setFormName] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  // --- LOGIQUE METIER (CALCULS) ---

  // Fonction utilitaire pour trouver le code département via coords
  const getDepartmentCodeFromCoords = (lat, lng) => {
    if (!departementsData) return null;
    const point = turf.point([lng, lat]);
    for (const feature of departementsData.features) {
      if (turf.booleanPointInPolygon(point, feature)) return feature.properties.code;
    }
    return null;
  };

  // C'est ici que la magie opère : on calcule la liste des départements visités
  // à la volée en regardant les lieux. Plus besoin de le stocker manuellement.
  const activeDepartments = useMemo(() => {
    if (!departementsData) return [];

    // On crée un Set (liste unique) des codes départements trouvés
    const foundCodes = new Set();

    visitedPlaces.forEach(place => {
      const code = getDepartmentCodeFromCoords(place.coords[0], place.coords[1]);
      if (code) foundCodes.add(code);
    });

    return Array.from(foundCodes);
  }, [visitedPlaces, departementsData]); // Se recalcule uniquement quand lieux ou carte changent


  const totalDepartments = departementsData ? departementsData.features.length : 0;
  const visitedCount = activeDepartments.length; // On utilise la liste calculée

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces)); }, [visitedPlaces]);
  useEffect(() => { localStorage.setItem("tripCategories", JSON.stringify(categories)); }, [categories]);

  // Note : On ne sauvegarde plus "visitedDepartments" dans le localStorage, car c'est dynamique.

  useEffect(() => {
    fetch("/departements.geojson")
      .then((res) => res.json())
      .then((data) => setDepartementsData(data));
  }, []);

  useEffect(() => {
    fetch("/world.geojson")
      .then((res) => res.json())
      .then((data) => setWorldData(data));
  }, []);


  // --- GESTION DU CLIC POUR AJOUTER (Centralisé) ---
  const openAddModal = (lat, lng) => {
    setNewPlaceModal({ isOpen: true, coords: [lat, lng], editIndex: null });
    setFormName("");
    setFormComment("");
    setFormCategoryId(categories[0]?.id || "");
  };

  // 1. LE STYLE (Ton style d'origine)
  const style = (feature) => {
    const isVisited = activeDepartments.includes(feature.properties.code);
    return {
      fillColor: isVisited ? "#4bbb83" : "#ffffff",
      // Si visité : 0 (transparent) pour voir la carte. Si pas visité : 0.4 (voile blanc)
      fillOpacity: isVisited ? 0.2 : 0,
      color: "#191919",
      // Si visité : bordure visible (1). Si pas visité : bordure discrète (0.1)
      opacity: isVisited ? 1 : 0.4,
      weight: 1
    };
  };

  const worldStyle = (feature) => {
    const name = feature.properties.name;

    if (name === "France") {
      return {
        fillOpacity: 0,
        opacity: 0
      };
    }

    if (isEuropeanCountry(feature)) {
      return {
        fillColor: "#000000",
        fillOpacity: 0.25,
        color: "#000000",
        weight: 1,
        opacity: 0.4
      };
    }

    // Hors Europe → totalement invisible
    return {
      fillOpacity: 0,
      opacity: 0
    };
  };



  // 2. LES INTERACTIONS (Ton survol d'origine)
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        // On garde la nouvelle logique : clic = ajout de lieu
        openAddModal(e.latlng.lat, e.latlng.lng);
      },
      mouseover: (e) => {
        // Au survol : on épaissit juste la bordure et on change sa couleur
        e.target.setStyle({ weight: 3, color: "#2e1e69" });
      },
      mouseout: (e) => {
        // En sortant : on remet le style EXACT selon l'état (visité ou non)
        const isVisited = activeDepartments.includes(feature.properties.code);
        e.target.setStyle({
          weight: 1,
          color: "#191919",
          opacity: isVisited ? 1 : 0.4, // On rétablit l'opacité du bord
          fillOpacity: isVisited ? 0.2 : 0 // On rétablit l'opacité du fond
        });
      }
    });
  };

  // --- ACTIONS ---

  const handleEdit = (index) => {
    const placeToEdit = visitedPlaces[index];
    setFormName(placeToEdit.name);
    setFormComment(placeToEdit.comment);
    const matchingCategory = categories.find(c => c.name === placeToEdit.category?.name);
    setFormCategoryId(matchingCategory ? matchingCategory.id : "");
    setNewPlaceModal({
      isOpen: true,
      coords: placeToEdit.coords,
      editIndex: index
    });
  };

  const saveNewPlace = () => {
    if (!formName) return alert("Le nom est obligatoire");
    const selectedCat = categories.find(c => c.id == formCategoryId);
    if (!selectedCat) return alert("Sélectionnez une catégorie");

    const placeData = {
      name: formName,
      comment: formComment,
      coords: newPlaceModal.coords,
      category: { name: selectedCat.name, color: selectedCat.color }
    };

    if (newPlaceModal.editIndex !== null) {
      const updatedPlaces = [...visitedPlaces];
      updatedPlaces[newPlaceModal.editIndex] = placeData;
      setVisitedPlaces(updatedPlaces);
    } else {
      setVisitedPlaces(prev => [...prev, placeData]);
      // Note: Plus besoin de mettre à jour visitedDepartments ici, c'est automatique !
    }

    setNewPlaceModal({ isOpen: false, coords: null, editIndex: null });
    setFormName("");
    setFormComment("");
    setFormCategoryId("");
  };

  const removePlace = (indexToRemove) => {
    if (window.confirm("Supprimer ce lieu ?")) {
      setVisitedPlaces(prev => prev.filter((_, index) => index !== indexToRemove));
      // Note: Si c'était le dernier lieu du département, le département redeviendra blanc automatiquement.
    }
  };

  const addCategory = (name, color) => {
    if (!name) return;
    const newCat = { id: Date.now(), name, color };
    setCategories([...categories, newCat]);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Supprimer ce type de voyage ?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  // Composant pour clic sur la carte (hors départements, ex: océan)
  function MapClickHandler({ onMapClick }) {
    useMapEvents({
      click(e) {
        // SIMPLIFICATION : Plus de shiftKey check. Clic simple = Ajout.
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  }

  return (
    <>
      <div style={{
        position: "absolute", top: "12px", right: "12px", zIndex: 1000,
        background: "white", padding: "10px 14px", borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)", textAlign: "right", fontFamily: "Arial"
      }}>
        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>Départements</div>
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
          {visitedCount} / {totalDepartments}
        </div>
        <button
          onClick={() => setShowCategoryManager(!showCategoryManager)}
          style={{ background: "#2e1e69", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
        >
          🎨 Gérer types de voyages
        </button>
      </div>

      {showCategoryManager && (
        <div style={{
          position: "absolute", top: "110px", right: "12px", zIndex: 1000,
          background: "white", padding: "15px", borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", width: "250px", fontFamily: "Arial"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Types de voyages</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 15px 0", maxHeight: "150px", overflowY: "auto" }}>
            {categories.map(cat => (
              <li key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: cat.color, marginRight: "8px" }}></span>
                  <span>{cat.name}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  style={{ background: "transparent", color: "#999", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px", padding: "0 5px" }}
                >
                  &times;
                </button>
              </li>
            ))}
            {categories.length === 0 && <li style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>Aucune catégorie.</li>}
          </ul>
          <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
            <div style={{ fontSize: "12px", marginBottom: "5px" }}>Nouveau type :</div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addCategory(e.target.catName.value, e.target.catColor.value);
              e.target.reset();
            }}>
              <input name="catName" placeholder="Ex: Roadtrip..." style={{ width: "60%", marginRight: "5px", padding: "4px" }} required />
              <input name="catColor" type="color" defaultValue="#ff0000" style={{ width: "20%", height: "26px", border: "none", verticalAlign: "bottom", padding: 0, cursor: "pointer" }} />
              <button type="submit" style={{ width: "100%", marginTop: "8px", background: "#27ae60", color: "white", border: "none", padding: "5px", cursor: "pointer", borderRadius: "3px" }}>Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {newPlaceModal.isOpen && (
        <div style={{
          position: "absolute", top: "0", left: "0", width: "100%", height: "100%",
          zIndex: 2000, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "320px", fontFamily: "Arial" }}>
            <h3 style={{ marginTop: 0 }}>
              {newPlaceModal.editIndex !== null ? "Modifier le lieu ✏️" : "Nouveau souvenir 📍"}
            </h3>

            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Nom du lieu</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box" }}
              autoFocus
            />

            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Commentaire</label>
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Avec qui ? Quel souvenir ?"
              style={{ width: "100%", padding: "8px", marginBottom: "12px", height: "60px", boxSizing: "border-box" }}
            />

            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Type de voyage</label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
            >
              <option value="">-- Choisir une catégorie --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setNewPlaceModal({ isOpen: false, coords: null, editIndex: null })} style={{ background: "#ccc", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Annuler</button>
              <button onClick={saveNewPlace} style={{ background: "#2e1e69", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>
                {newPlaceModal.editIndex !== null ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={[46.6, 2.5]}
        zoom={6}
        minZoom={4}
        maxBounds={[
          [30, -15],   // Sud-Ouest (Atlantique / Maroc)
          [65, 25]     // Nord-Est (Scandinavie / Europe Est)
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {worldData && (
          <GeoJSON
            data={worldData}
            style={worldStyle}
            interactive={false} // important → ne bloque pas les clics
          />
        )}


        {/* Composant qui gère le clic sur le fond de carte */}
        <MapClickHandler onMapClick={openAddModal} />

        {departementsData && (
          <GeoJSON
            data={departementsData}
            style={style}
            onEachFeature={onEachFeature}
            // On utilise la liste activeDepartments pour forcer le re-rendu quand ça change
            key={activeDepartments.join(',')}
          />
        )}

        {visitedPlaces.map((place, idx) => (
          <Marker
            key={idx}
            position={place.coords}
            icon={createCustomIcon(place.category?.color || "#333")}
          >
            <Popup>
              <div style={{ fontFamily: "Arial", textAlign: "center", minWidth: "150px" }}>
                <strong style={{ fontSize: "14px" }}>{place.name}</strong>
                <div style={{
                  marginTop: "6px", marginBottom: "6px",
                  display: "inline-block", padding: "2px 8px", borderRadius: "12px",
                  background: place.category?.color || "#eee", color: "white", fontSize: "11px", fontWeight: "bold"
                }}>
                  {place.category?.name || "Inconnu"}
                </div>
                <div style={{ fontSize: "13px", fontStyle: "italic", color: "#555", marginBottom: "10px" }}>
                  "{place.comment}"
                </div>
                <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  <button onClick={() => handleEdit(idx)} style={{ background: "#3498db", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Modifier</button>
                  <button onClick={() => removePlace(idx)} style={{ background: "#e74c3c", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Supprimer</button>
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