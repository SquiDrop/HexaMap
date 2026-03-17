// Côte Atlantique & Manche
const ATLANTIC_DEPTS = [
  "14","17","22","29","33","35","40","44","50","56","59","62","64","76","85"
];

// Côte Méditerranée
const MEDITERRANEAN_DEPTS = [
  "06","13","34","66","83","2A","2B"
];

// Alpes (départements alpins stricts)
const ALPINE_DEPTS = [
  "04","05","06","38","73","74"
];

// Pyrénées
const PYRENEAN_DEPTS = [
  "09","64","65","66"
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
  { id: "cat_rando_3",       type: "categorie", label: "Randonneur",            description: "3 lieux Rando & Nature",              target: 3,  unit: "lieux", categoryName: "Rando & Nature" },
  { id: "cat_rando_7",       type: "categorie", label: "Grand randonneur 🥾",      description: "7 lieux Rando & Nature",              target: 7,  unit: "lieux", categoryName: "Rando & Nature" },
  { id: "cat_mer_3",         type: "categorie", label: "Marin d'eau douce",     description: "3 lieux Vacances à la mer",           target: 3,  unit: "lieux", categoryName: "Vacances à la mer" },
  { id: "cat_mer_8",         type: "categorie", label: "Seigneur des mers 🔱",description: "8 lieux Vacances à la mer",          target: 8,  unit: "lieux", categoryName: "Vacances à la mer" },
  { id: "cat_gastro_3",      type: "categorie", label: "Gourmet",               description: "3 lieux Gastronomie & Terroir",       target: 3,  unit: "lieux", categoryName: "Gastronomie & Terroir" },
  { id: "cat_gastro_8",      type: "categorie", label: "Chef étoilé 👨‍🍳",           description: "8 lieux Gastronomie & Terroir",       target: 8,  unit: "lieux", categoryName: "Gastronomie & Terroir" },
  { id: "cat_ski_2",         type: "categorie", label: "Skieur",                description: "2 lieux Ski & Montagne",              target: 2,  unit: "lieux", categoryName: "Ski & Montagne" },
  { id: "cat_ski_5",         type: "categorie", label: "Roi de la glisse ⛷️",             description: "5 lieux Ski & Montagne",              target: 5,  unit: "lieux", categoryName: "Ski & Montagne" },
  { id: "cat_culture_3",     type: "categorie", label: "Curieux culturel",      description: "3 lieux Culture & Patrimoine",        target: 3,  unit: "lieux", categoryName: "Culture & Patrimoine" },
  { id: "cat_culture_8",     type: "categorie", label: "Historien passionné 🏺",   description: "8 lieux Culture & Patrimoine",        target: 8,  unit: "lieux", categoryName: "Culture & Patrimoine" },
  { id: "cat_romantique_2",  type: "categorie", label: "Romantique",            description: "2 lieux Escapade romantique",         target: 2,  unit: "lieux", categoryName: "Escapade romantique" },
  { id: "cat_romantique_5",  type: "categorie", label: "Grand romantique 😍",      description: "5 lieux Escapade romantique",         target: 5,  unit: "lieux", categoryName: "Escapade romantique" },
  { id: "cat_roadtrip_3",    type: "categorie", label: "Roadtripper 🚗",           description: "3 lieux Découverte & Roadtrip",       target: 3,  unit: "lieux", categoryName: "Découverte & Roadtrip" },
  { id: "cat_cepes_5",       type: "categorie", label: "Chasseur de champis 🍄",     description: "5 lieux Coins à cèpes",               target: 5,  unit: "lieux", categoryName: "Coins à cèpes" },
  // — Géographiques —
  { id: "geo_atlantic_5",    type: "geo", label: "L'appel du large",        description: "Visiter 5 dpts Atlantique & Manche",   target: 5,  unit: "dpt atlantiques",    deptList: ATLANTIC_DEPTS },
  { id: "geo_atlantic_10",   type: "geo", label: "Tour du littoral",        description: "Visiter 10 dpts Atlantique & Manche",  target: 10, unit: "dpt atlantiques",    deptList: ATLANTIC_DEPTS },
  { id: "geo_atlantic_15",   type: "geo", label: "Conquête du littoral",    description: "Visiter les 15 dpts Atlantique & Manche", target: 15, unit: "dpt atlantiques", deptList: ATLANTIC_DEPTS },
  { id: "geo_med_3",         type: "geo", label: "Méditerranéen",           description: "Visiter 3 dpts méditerranéens",        target: 3,  unit: "dpt méditerranéens", deptList: MEDITERRANEAN_DEPTS },
  { id: "geo_med_6",         type: "geo", label: "Azur & Mistral",          description: "Visiter 6 dpts méditerranéens",        target: 6,  unit: "dpt méditerranéens", deptList: MEDITERRANEAN_DEPTS },
  { id: "geo_alpine_3",      type: "geo", label: "Alpiniste",               description: "Visiter 3 dpts alpins",                target: 3,  unit: "dpt alpins",          deptList: ALPINE_DEPTS },
  { id: "geo_alpine_6",      type: "geo", label: "Conquête des Alpes",      description: "Visiter les 6 dpts alpins",            target: 6,  unit: "dpt alpins",          deptList: ALPINE_DEPTS },
  { id: "geo_pyrenees_2",    type: "geo", label: "Pyrénéen",                description: "Visiter 2 dpts pyrénéens",             target: 2,  unit: "dpt pyrénéens",       deptList: PYRENEAN_DEPTS },
  { id: "geo_pyrenees_4",    type: "geo", label: "Traversée des Pyrénées",  description: "Visiter les 4 dpts pyrénéens",         target: 4,  unit: "dpt pyrénéens",       deptList: PYRENEAN_DEPTS },
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