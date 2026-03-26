import { useState, useEffect, useMemo, useRef } from "react";
import { PRESET_CHALLENGES, computeChallengeProgress } from "./useObjectives";

const BADGE_KEY = "earnedBadges";

/**
 * Suit les badges débloqués (= défis complétés).
 * - Au premier chargement : sauvegarde silencieusement les défis déjà complétés.
 * - Ensuite : détecte les nouvelles complétion et les retourne dans `newBadges`.
 */
export function useBadges({ activeDepartments, activeRegions, visitedPlaces }) {
  const [newBadges, setNewBadges] = useState([]);
  const isInitializedRef = useRef(false);

  const completedIds = useMemo(() => {
    return PRESET_CHALLENGES
      .filter(c => computeChallengeProgress(c, { activeDepartments, activeRegions, visitedPlaces }).completed)
      .map(c => c.id);
  }, [activeDepartments, activeRegions, visitedPlaces]);

  useEffect(() => {
    const stored = localStorage.getItem(BADGE_KEY);

    if (stored === null) {
      // Première utilisation : sauvegarde l'état actuel sans notification
      localStorage.setItem(BADGE_KEY, JSON.stringify(completedIds));
      isInitializedRef.current = true;
      return;
    }

    if (!isInitializedRef.current) {
      // Chargement depuis une session précédente : pas de notification
      isInitializedRef.current = true;
      return;
    }

    const saved = JSON.parse(stored);

    // Retire les badges dont le défi n'est plus complété (lieu supprimé)
    // → ils pourront se re-déclencher quand le lieu est rajouté
    const stillValid = saved.filter(id => completedIds.includes(id));

    // Détecte les badges nouvellement débloqués
    const freshIds = completedIds.filter(id => !saved.includes(id));

    const updated = [...stillValid, ...freshIds];
    if (updated.length !== saved.length || freshIds.length > 0) {
      localStorage.setItem(BADGE_KEY, JSON.stringify(updated));
    }
    if (freshIds.length > 0) {
      setNewBadges(prev => [...prev, ...PRESET_CHALLENGES.filter(c => freshIds.includes(c.id))]);
    }
  }, [completedIds]);

  const dismissBadge = () => setNewBadges(prev => prev.slice(1));

  // earnedIds = tous les badges débloqués (pour l'affichage dans ObjectivesPanel)
  const earnedIds = useMemo(() => {
    const stored = localStorage.getItem(BADGE_KEY);
    return stored ? JSON.parse(stored) : completedIds;
  }, [completedIds]);

  return { earnedIds, newBadges, dismissBadge };
}
