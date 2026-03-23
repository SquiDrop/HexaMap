function StatsPanel({
  visitedDeptCount,
  totalDepartments,
  visitedRegionCount,
  totalRegions,
  viewMode,
  onToggleViewMode,
  onToggleCategories,
  onToggleObjectives,
  showObjectives,
  lastPlace,
  topCategory,
}) {
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
      textAlign: "right",
      fontFamily: "Arial",
      minWidth: "220px",
    }}>
      <div style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Départements</div>
      <div style={{ fontSize: "40px", fontWeight: "bold", lineHeight: 1.1 }}>
        {visitedDeptCount} / {totalDepartments}
      </div>

      <div style={{ fontSize: "16px", fontWeight: "bold", color: "#555", marginTop: "6px" }}>Régions</div>
      <div style={{ fontSize: "40px", fontWeight: "bold", lineHeight: 1.1, marginBottom: "12px" }}>
        {visitedRegionCount} / {totalRegions}
      </div>

      {topCategory && (
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
          <span style={{ fontWeight: "bold", color: "#555" }}>Catégorie favorite</span><br />
          {topCategory.name} ({topCategory.count})
        </div>
      )}

      {lastPlace && (
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>
          <span style={{ fontWeight: "bold", color: "#555" }}>Dernier lieu</span><br />
          {lastPlace.name}
        </div>
      )}

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