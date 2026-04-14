# HexaMap 🗺️

**HexaMap** (contraction de Hexagone et Map) est une application web interactive de suivi de voyages centrée sur la France. Elle permet de visualiser ses lieux visités sur une carte, de suivre sa progression département par département, et de débloquer des défis au fil de l'exploration.

---

## Lancer l'application

```bash
cd travel-map
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

---

## Fonctionnalités

### Carte interactive
- Carte de France avec zoom et déplacement libres
- Les pays voisins apparaissent grisés pour mettre la France en valeur
- Basculer entre la **vue Départements** et la **vue Régions** via le panneau en haut à droite

### Ajouter un lieu
Cliquer n'importe où sur la carte pour ouvrir le formulaire d'ajout :
- **Nom** du lieu (obligatoire)
- **Commentaire** libre
- **Type de voyage** — catégorie parmi 13 types prédéfinis (ou créer le sien)
- **Période** — saison (Printemps / Été / Automne / Hiver) et année, optionnelles
- **Photo** — ajout et compression automatique

Le département correspondant se **colorie automatiquement** 1 seconde après la validation, accompagné d'un son.

### Types de voyages (catégories)
13 catégories disponibles par défaut : Escapade romantique, Sortie entre potes, Culture & Patrimoine, Voyage Solo, Vacances à la mer, Découverte & Roadtrip, Rando & Nature, Gastronomie & Terroir, Famille & Maison, Déplacement pro, Journées de ski, Montagne, Coins à champignon.

Il est possible de **créer ses propres catégories** via le bouton *Gérer types de voyages*.

### Statistiques
Le bouton **📊 Statistiques** affiche :
- Nombre total de lieux, départements et régions visités
- Catégorie favorite et dernier lieu ajouté
- Barres de progression France (départements et régions)
- Répartition des lieux par catégorie

### Données persistantes
Toutes les données (lieux, catégories) sont sauvegardées en **localStorage** — elles survivent aux rechargements de page.

---

## Défis & Gamification

Les défis se débloquent automatiquement au fil de l'exploration. Un **badge animé** apparaît avec un son lorsqu'un défi est complété. Si plusieurs défis sont débloqués en même temps, les badges s'affichent à la suite.

### 📍 Départements
| Défi | Objectif |
|------|----------|
| Explorateur | Visiter 10 départements |
| Grand voyageur | Visiter 25 départements |
| Mi-chemin | Visiter 50 départements |
| L'Hexagone complet | Visiter les 96 départements |

### 🗺️ Régions
| Défi | Objectif |
|------|----------|
| Première région | Compléter 1 région entière |
| Collectionneur | Compléter 5 régions |
| Maître de l'Hexagone | Compléter les 13 régions |

> Une région est complétée uniquement quand **tous** ses départements sont visités.

### 🏷️ Catégories
| Défi | Objectif |
|------|----------|
| Randonneur | 3 lieux Rando & Nature |
| Grand randonneur | 7 lieux Rando & Nature |
| Marin d'eau douce | 3 lieux Vacances à la mer |
| Capitaine au long cours | 8 lieux Vacances à la mer |
| Gourmet | 3 lieux Gastronomie & Terroir |
| Chef étoilé | 8 lieux Gastronomie & Terroir |
| Skieur | 2 lieux Journées de ski |
| Freerider | 5 lieux Journées de ski |
| Montagnard | 2 lieux Montagne |
| Conquérant des sommets | 5 lieux Montagne |
| Curieux culturel | 3 lieux Culture & Patrimoine |
| Historien passionné | 8 lieux Culture & Patrimoine |
| Romantique | 2 lieux Escapade romantique |
| Grand romantique | 5 lieux Escapade romantique |
| Roadtripper | 3 lieux Découverte & Roadtrip |
| Chasseur de champis | 5 lieux Coins à champignon |

### 🌊 Géographiques

**Côte Atlantique & Manche** *(15 départements)*
| Défi | Objectif |
|------|----------|
| L'appel du large | 5 départements atlantiques |
| Tour du littoral | 10 départements atlantiques |
| Conquête du littoral | Les 15 départements atlantiques |

**Côte Méditerranée** *(7 départements : 06, 13, 34, 66, 83, 2A, 2B)*
| Défi | Objectif |
|------|----------|
| Méditerranéen | 3 départements méditerranéens |
| Azur & Mistral | 6 départements méditerranéens |

**Alpes** *(6 départements : 04, 05, 06, 38, 73, 74)*
| Défi | Objectif |
|------|----------|
| Alpiniste | 3 départements alpins |
| Conquête des Alpes | Les 6 départements alpins |

**Pyrénées** *(4 départements : 09, 64, 65, 66)*
| Défi | Objectif |
|------|----------|
| Pyrénéen | 2 départements pyrénéens |
| Traversée des Pyrénées | Les 4 départements pyrénéens |

---

## Stack technique

| Technologie | Rôle |
|-------------|------|
| React | Interface utilisateur |
| Leaflet / React-Leaflet | Carte interactive |
| OpenStreetMap | Fond de carte |
| GeoJSON | Données géographiques (départements, régions, pays) |
| Turf.js | Détection département depuis coordonnées GPS |
| localStorage | Persistance des données |
| Web Audio / fichiers MP3 | Sons de gamification |
| Canvas API | Compression des photos |

---

## Structure du projet

```
travel-map/
├── public/
│   ├── departements.geojson
│   ├── regions.geojson
│   ├── world.geojson
│   └── sounds/
│       ├── dept-unlock.wav
│       └── badge-unlock.mp3
└── src/
    ├── components/
    │   ├── MapView.jsx        # Composant principal de la carte
    │   ├── StatsPanel.jsx     # Panneau de contrôle (haut droite)
    │   ├── StatsDrawer.jsx    # Panneau statistiques détaillées
    │   ├── ObjectivesPanel.jsx# Panneau des défis
    │   ├── BadgeToast.jsx     # Notification badge débloqué
    │   ├── PlaceModal.jsx     # Formulaire ajout/édition lieu
    │   ├── CategoryManager.jsx# Gestionnaire de catégories
    │   └── LandingPage.jsx    # Page d'accueil
    ├── hooks/
    │   ├── useVisitedPlaces.js# État des lieux et catégories
    │   ├── useBadges.js       # Détection et file des badges
    │   └── useObjectives.js   # Définition des défis
    └── utils/
        ├── mapUtils.js        # Styles carte, géospatial, régions
        └── sounds.js          # Fonctions de lecture audio
```

---

*Projet P2I — ENSC S8 — Alex Marot*
