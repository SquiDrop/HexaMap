/**
 * Panneau en haut à droite :
 * - compteur départements visités
 * - compteur régions complétées
 * - bouton toggle Département / Région
 * - bouton gestion des catégories
 */
function StatsPanel({
  visitedDeptCount,
  totalDepartments,
  visitedRegionCount,
  totalRegions,
  viewMode,
  onToggleViewMode,
  onToggleCategories,
}) {
  const isRegionMode = viewMode === "region";

  return (
    <div style={{
      position: "absolute",
      top: "12px",
      right: "12px",
      zIndex: 1000,
      background: "white",
      padding: "10px 14px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      textAlign: "right",
      fontFamily: "Arial",
      minWidth: "220px",
    }}>
      {/* Compteur départements */}
      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#555" }}>
        Départements
      </div>
      <div style={{ fontSize: "42px", fontWeight: "bold", lineHeight: 1.1 }}>
        {visitedDeptCount} / {totalDepartments}
      </div>

      {/* Compteur régions */}
      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#555", marginTop: "8px" }}>
        Régions
      </div>
      <div style={{ fontSize: "42px", fontWeight: "bold", lineHeight: 1.1, marginBottom: "12px" }}>
        {visitedRegionCount} / {totalRegions}
      </div>

      {/* Bouton toggle vue */}
      <button
        onClick={onToggleViewMode}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "8px",
          background: isRegionMode ? "#2e1e69" : "#f0f0f0",
          color: isRegionMode ? "white" : "#333",
          border: "2px solid #2e1e69",
          padding: "6px 10px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "all 0.2s",
        }}
      >
        {isRegionMode ? "🗺️ Vue Régions" : "🗺️ Vue Départements"}
      </button>

      {/* Bouton catégories */}
      <button
        onClick={onToggleCategories}
        style={{
          display: "block",
          width: "100%",
          background: "#2e1e69",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        🎨 Gérer types de voyages
      </button>
    </div>
  );
}

export default StatsPanel;