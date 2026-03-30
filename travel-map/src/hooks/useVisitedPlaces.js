import { useState, useMemo } from "react";
import { getDepartmentCodeFromCoords } from "../utils/mapUtils";

// à incrémenter à chaque fois qu'on modifie DEFAULT_CATEGORIES,
// sinon les anciens localStorage gardent l'ancienne version
const CATEGORIES_VERSION = 5;

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Escapade romantique", color: "#E63946" },
  { id: 2, name: "Sortie entre potes", color: "#db6591" },
  { id: 3, name: "Culture & Patrimoine", color: "#8E44AD" },
  { id: 4, name: "Voyage Solo", color: "#3949AB" },
  { id: 5, name: "Vacances à la mer", color: "#1E88E5" },
  { id: 6, name: "Découverte & Roadtrip", color: "#00897B" },
  { id: 7, name: "Rando & Nature", color: "#43A047" },
  { id: 8, name: "Gastronomie & Terroir", color: "#F4511E" },
  { id: 9, name: "Famille & Maison", color: "#6D4C41" },
  { id: 10, name: "Déplacement pro", color: "#546E7A" },
  { id: 11, name: "Journées de ski", color: "#242323" },
  { id: 12, name: "Montagne", color: "#0097A7" },
  { id: 13, name: "Coins à champignon", color: "#C08552" },
];

const DEFAULT_PLACES = [
  {
    name: "ENSC",
    coords: [44.8153, -0.5742],
    comment: "L'école !",
    category: { name: "Déplacement pro", color: "#546E7A" },
  },
];

export function useVisitedPlaces(departementsData) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("tripCategories");
    if (saved) {
      const { version, data } = JSON.parse(saved);
      if (version === CATEGORIES_VERSION) return data;
    }
    return DEFAULT_CATEGORIES;
  });

  const [visitedPlaces, setVisitedPlaces] = useState(() => {
    const saved = localStorage.getItem("visitedPlaces");
    return saved ? JSON.parse(saved) : DEFAULT_PLACES;
  });

  useMemo(() => {
    localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
  }, [visitedPlaces]);

  useMemo(() => {
    localStorage.setItem("tripCategories", JSON.stringify({ version: CATEGORIES_VERSION, data: categories }));
  }, [categories]);

  const activeDepartments = useMemo(() => {
    if (!departementsData) return [];
    const foundCodes = new Set();
    visitedPlaces.forEach((place) => {
      const code = getDepartmentCodeFromCoords(
        place.coords[0],
        place.coords[1],
        departementsData
      );
      if (code) foundCodes.add(code);
    });
    return Array.from(foundCodes);
  }, [visitedPlaces, departementsData]);

  const addPlace = (placeData) => {
    setVisitedPlaces((prev) => [...prev, placeData]);
  };

  const updatePlace = (index, placeData) => {
    setVisitedPlaces((prev) => {
      const updated = [...prev];
      updated[index] = placeData;
      return updated;
    });
  };

  const removePlace = (index) => {
    if (window.confirm("Supprimer ce lieu ?")) {
      setVisitedPlaces((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addCategory = (name, color) => {
    if (!name) return;
    setCategories((prev) => [...prev, { id: Date.now(), name, color }]);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Supprimer ce type de voyage ?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  return {
    visitedPlaces,
    categories,
    activeDepartments,
    addPlace,
    updatePlace,
    removePlace,
    addCategory,
    deleteCategory,
  };
}