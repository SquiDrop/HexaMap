function StatsPanel({ viewMode, onToggleViewMode, onToggleCategories, onToggleObjectives, showObjectives, onToggleStats, showStats }) {
  const isRegionMode = viewMode === "region";

  const btnBase = {
    display: "block",
    width: "100%",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "6px",
    border: "none",
    textAlign: "left",
  };

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
      fontFamily: "Arial",
      minWidth: "220px",
    }}>
      <button
        onClick={onToggleViewMode}
        style={{
          ...btnBase,
          background: isRegionMode ? "#2e1e69" : "#f0f0f0",
          color: isRegionMode ? "white" : "#333",
          border: "2px solid #2e1e69",
        }}
      >
        {isRegionMode ? "🗺️ Vue Régions" : "🗺️ Vue Départements"}
      </button>

      <button
        onClick={onToggleStats}
        style={{
          ...btnBase,
          background: showStats ? "#2e1e69" : "#f0f0f0",
          color: showStats ? "white" : "#333",
          border: "2px solid #2e1e69",
        }}
      >
        📊 Statistiques
      </button>

      <button
        onClick={onToggleObjectives}
        style={{
          ...btnBase,
          background: showObjectives ? "#2e1e69" : "#f0f0f0",
          color: showObjectives ? "white" : "#333",
          border: "2px solid #2e1e69",
        }}
      >
        🎯 Défis
      </button>

      <button
        onClick={onToggleCategories}
        style={{ ...btnBase, background: "#2e1e69", color: "white", marginBottom: 0 }}
      >
        🎨 Gérer types de voyages
      </button>
    </div>
  );
}

export default StatsPanel;
