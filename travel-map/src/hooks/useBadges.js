import { useState, useEffect, useMemo, useRef } from "react";
import { PRESET_CHALLENGES, computeChallengeProgress } from "./useObjectives";
import { playBadgeUnlock } from "../utils/sounds";

const BADGE_KEY = "earnedBadges";

export function useBadges({ activeDepartments, activeRegions, visitedPlaces, departementsLoaded }) {
  const [newBadges, setNewBadges] = useState([]);
  const prevCompletedRef = useRef(null);

  const completedIds = useMemo(() => {
    return PRESET_CHALLENGES
      .filter(c => computeChallengeProgress(c, { activeDepartments, activeRegions, visitedPlaces }).completed)
      .map(c => c.id);
  }, [activeDepartments, activeRegions, visitedPlaces]);

  useEffect(() => {
    // React StrictMode exécute les effets 2x au montage en dev —
    // sans ce guard, la 2ème exécution voit completedIds=[] (GeoJSON pas encore là)
    // et ecrase le baseline, ce qui declenche toutes les notifs au prochain chargement.
    if (!departementsLoaded) return;

    if (prevCompletedRef.current === null) {
      // On part du localStorage comme baseline plutôt que de l'état actuel,
      // sinon tous les défis déjà complétés notifient à chaque relance.
      const stored = localStorage.getItem(BADGE_KEY);
      prevCompletedRef.current = stored !== null ? JSON.parse(stored) : completedIds;
      if (stored === null) localStorage.setItem(BADGE_KEY, JSON.stringify(completedIds));
      return;
    }

    const prev = prevCompletedRef.current;
    prevCompletedRef.current = completedIds;
    localStorage.setItem(BADGE_KEY, JSON.stringify(completedIds));

    const freshIds = completedIds.filter(id => !prev.includes(id));
    if (freshIds.length > 0) {
      playBadgeUnlock();
      setNewBadges(q => [...q, ...PRESET_CHALLENGES.filter(c => freshIds.includes(c.id))]);
    }
  }, [completedIds, departementsLoaded]);

  const dismissBadge = () => setNewBadges(prev => prev.slice(1));

  return { newBadges, dismissBadge };
}
