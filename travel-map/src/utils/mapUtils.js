import L from "leaflet";
import * as turf from "@turf/turf";

export const createCustomIcon = (color) => {
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

export const getDepartmentCodeFromCoords = (lat, lng, departementsData) => {
  if (!departementsData) return null;
  // turf attend [lng, lat], pas [lat, lng] comme Leaflet — à ne pas inverser
  const point = turf.point([lng, lat]);
  for (const feature of departementsData.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature.properties.code;
    }
  }
  return null;
};

export const REGIONS_META = [
  { code: "84", nom: "Auvergne-Rhône-Alpes",       departements: ["01","03","07","15","26","38","42","43","63","69","73","74"] },
  { code: "27", nom: "Bourgogne-Franche-Comté",     departements: ["21","25","39","58","70","71","89","90"] },
  { code: "53", nom: "Bretagne",                    departements: ["22","29","35","56"] },
  { code: "24", nom: "Centre-Val de Loire",         departements: ["18","28","36","37","41","45"] },
  { code: "94", nom: "Corse",                       departements: ["2A","2B"] },
  { code: "44", nom: "Grand Est",                   departements: ["08","10","51","52","54","55","57","67","68","88"] },
  { code: "32", nom: "Hauts-de-France",             departements: ["02","59","60","62","80"] },
  { code: "11", nom: "Île-de-France",               departements: ["75","77","78","91","92","93","94","95"] },
  { code: "28", nom: "Normandie",                   departements: ["14","27","50","61","76"] },
  { code: "75", nom: "Nouvelle-Aquitaine",          departements: ["16","17","19","23","24","33","40","47","64","79","86","87"] },
  { code: "76", nom: "Occitanie",                   departements: ["09","11","12","30","31","32","34","46","48","65","66","81","82"] },
  { code: "52", nom: "Pays de la Loire",            departements: ["44","49","53","72","85"] },
  { code: "93", nom: "Provence-Alpes-Côte d'Azur", departements: ["04","05","06","13","83","84"] },
];

// une région est "complétée" seulement si TOUS ses dpts sont visités
export const getActiveRegions = (activeDepartments) => {
  return REGIONS_META
    .filter((region) =>
      region.departements.every((dpt) => activeDepartments.includes(dpt))
    )
    .map((region) => region.code);
};

const NEARBY_COUNTRIES = [
  "Spain", "Portugal", "Italy", "Belgium", "Netherlands", "Germany",
  "Switzerland", "Austria", "United Kingdom", "Ireland", "Luxembourg",
  "Denmark", "Poland", "Czechia", "Slovakia", "Hungary", "Slovenia",
  "Croatia", "Bosnia and Herz.", "Serbia", "Montenegro", "Albania",
  "Greece", "Bulgaria", "Romania", "Norway", "Sweden", "Finland",
  "Czech Republic", "Bosnia and Herzegovina", "Kosovo", "Republic of Serbia",
  "Macedonia", "Morocco", "Algeria", "Libya", "Tunisia", "Russia", "Ukraine",
  "Moldova", "Latvia", "Lithuania", "Estonia", "Belarus", "Egypt", "Syria",
  "Israel", "Jordan", "Turkey", "Lebanon", "Palestine", "Saudi Arabia",
  "Iraq", "Armenia", "Azerbaijan", "Georgia", "Iran",
];

export const getWorldStyle = (feature) => {
  const name = feature.properties.name;
  if (name === "France") return { fillOpacity: 0, opacity: 0 }; // transparent pour laisser le fond OSM
  if (NEARBY_COUNTRIES.includes(name)) {
    return {
      fillColor: "#000000",
      fillOpacity: 0.25,
      color: "#000000",
      weight: 1,
      opacity: 0.4,
    };
  }
  return { fillOpacity: 0, opacity: 0 };
};

export const getDepartmentStyle = (feature, activeDepartments) => {
  const isVisited = activeDepartments.includes(feature.properties.code);
  return {
    fillColor: isVisited ? "#0400ff" : "#ffffff",
    fillOpacity: isVisited ? 0.2 : 0,
    color: "#191919",
    opacity: isVisited ? 1 : 0.4,
    weight: 1,
  };
};

export const getRegionStyle = (feature, activeRegions) => {
  const code = feature.properties.code;
  const isVisited = activeRegions.includes(code);
  return {
    fillColor: isVisited ? "#0400ff" : "#ffffff",
    fillOpacity: isVisited ? 0.2 : 0,
    color: "#191919",
    opacity: isVisited ? 1 : 0.6,
    weight: 2,
  };
};
