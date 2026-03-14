// Départements côtiers (façades Atlantique, Manche, Méditerranée)
const COASTAL_DEPTS = [
  "14","17","22","29","33","34","35","40","44","50",
  "56","59","62","64","66","76","83","85","06","13","2A","2B"
];

// Départements de montagne (Alpes, Pyrénées, Massif Central, Vosges, Jura)
const MOUNTAIN_DEPTS = [
  "01","04","05","06","07","09","12","15","19","23","25",
  "38","39","42","43","48","63","65","66","69","73","74","88"
];

export const PRESET_CHALLENGES = [
  // — Départements —
  { id: "dept_10",   type: "departement", label: "Explorateur",          description: "Visiter 10 départements",     target: 10,  unit: "dpt" },
  { id: "dept_25",   type: "departement", label: "Grand voyageur",       description: "Visiter 25 départements",     target: 25,  unit: "dpt" },
  { id: "dept_50",   type: "departement", label: "Mi-chemin",            description: "Visiter 50 départements",     target: 50,  unit: "dpt" },
  { id: "dept_96",   type: "departement", label: "L'Hexagone complet",   description: "Visiter les 96 départements", target: 96,  unit: "dpt" },
  // — Régions —
  { id: "region_1",  type: "region",      label: "Première région",      description: "Compléter 1 région",          target: 1,   unit: "région" },
  { id: "region_5",  type: "region",      label: "Collectionneur",       description: "Compléter 5 régions",         target: 5,   unit: "régions" },
  { id: "region_13", type: "region",      label: "Maître de l'Hexagone", description: "Compléter les 13 régions",    target: 13,  unit: "régions" },
  // — Catégories —
  { id: "cat_rando",  type: "categorie", label: "Randonneur",       description: "3 lieux Rando & Nature",         target: 3, unit: "lieux", categoryName: "Rando & Nature" },
  { id: "cat_mer",    type: "categorie", label: "Marin d'eau douce",description: "3 lieux Vacances à la mer",      target: 3, unit: "lieux", categoryName: "Vacances à la mer" },
  { id: "cat_gastro", type: "categorie", label: "Gourmet",          description: "3 lieux Gastronomie & Terroir",  target: 3, unit: "lieux", categoryName: "Gastronomie & Terroir" },
  { id: "cat_ski",    type: "categorie", label: "Skieur",           description: "2 lieux Ski & Montagne",         target: 2, unit: "lieux", categoryName: "Ski & Montagne" },
  // — Géographiques —
  { id: "geo_coast_5",  type: "geo", label: "L'appel du large",  description: "Visiter 5 départements côtiers",    target: 5,  unit: "dpt côtiers",  deptList: COASTAL_DEPTS },
  { id: "geo_coast_10", type: "geo", label: "Tour du littoral",  description: "Visiter 10 départements côtiers",   target: 10, unit: "dpt côtiers",  deptList: COASTAL_DEPTS },
  { id: "geo_mountain", type: "geo", label: "Homme des sommets", description: "Visiter 5 départements de montagne",target: 5,  unit: "dpt montagne", deptList: MOUNTAIN_DEPTS },
];

/**
 * Calcule la progression d'un défi prédéfini.
 * Retourne { current, target, percent, completed }
 */
export const computeChallengeProgress = (challenge, { activeDepartments, activeRegions, visitedPlaces }) => {
  let current = 0;

  switch (challenge.type) {
    case "departement":
      current = activeDepartments.length;
      break;
    case "region":
      current = activeRegions.length;
      break;
    case "categorie":
      current = visitedPlaces.filter(p => p.category?.name === challenge.categoryName).length;
      break;
    case "geo":
      current = activeDepartments.filter(code => challenge.deptList.includes(code)).length;
      break;
    default:
      current = 0;
  }

  return {
    current,
    target: challenge.target,
    percent: Math.min(100, Math.round((current / challenge.target) * 100)),
    completed: current >= challenge.target,
  };
};