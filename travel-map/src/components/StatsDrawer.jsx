function Bar({ value, max, color = "#2e1e69" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#eee", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px", transition: "width 0.4s ease" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatsDrawer({ onClose, visitedPlaces, activeDepartments, activeRegions, totalDepartments, totalRegions }) {
  const lastPlace = visitedPlaces.length > 0 ? visitedPlaces[visitedPlaces.length - 1] : null;

  // Comptage par catégorie
  const catMap = {};
  visitedPlaces.forEach(p => {
    if (!p.category?.name) return;
    if (!catMap[p.category.name]) catMap[p.category.name] = { count: 0, color: p.category.color };
    catMap[p.category.name].count++;
  });
  const sortedCats = Object.entries(catMap).sort((a, b) => b[1].count - a[1].count);
  const maxCatCount = sortedCats[0]?.[1].count || 1;
  const topCat = sortedCats[0];


  const row = { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "13px" };

  return (
    <div style={{
      position: "absolute",
      top: "12px",
      right: "270px",
      zIndex: 1000,
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      width: "290px",
      fontFamily: "Arial",
      display: "flex",
      flexDirection: "column",
      maxHeight: "85vh",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px 12px" }}>
        <h4 style={{ margin: 0, fontSize: "15px" }}>📊 Statistiques</h4>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: "#999", lineHeight: 1 }}>
          &times;
        </button>
      </div>

      <div style={{ overflowY: "auto", padding: "0 15px 15px" }}>

        <Section title="Chiffres clés">
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div style={{ flex: 1, background: "#f7f4ff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "bold", color: "#2e1e69" }}>{visitedPlaces.length}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>lieux ajoutés</div>
            </div>
            <div style={{ flex: 1, background: "#f7f4ff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "bold", color: "#2e1e69" }}>{activeDepartments.length}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>départements visités</div>
            </div>
            <div style={{ flex: 1, background: "#f7f4ff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "bold", color: "#2e1e69" }}>{activeRegions.length}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>régions complétées</div>
            </div>
          </div>

          {topCat && (
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              ⭐ <strong>Catégorie favorite :</strong>{" "}
              <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: topCat[1].color, verticalAlign: "middle", marginRight: "3px" }} />
              {topCat[0]} ({topCat[1].count})
            </div>
          )}
          {lastPlace && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              📌 <strong>Dernier lieu :</strong> {lastPlace.name}
              {(lastPlace.date?.season || lastPlace.date?.year) && (
                <span style={{ color: "#aaa" }}> · {[lastPlace.date.season, lastPlace.date.year].filter(Boolean).join(" ")}</span>
              )}
            </div>
          )}
        </Section>

        <Section title="Progression">
          <div style={row}>
            <span style={{ width: "90px", fontSize: "12px", color: "#555" }}>Départements</span>
            <Bar value={activeDepartments.length} max={totalDepartments} />
            <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{activeDepartments.length}/{totalDepartments}</span>
          </div>
          <div style={row}>
            <span style={{ width: "90px", fontSize: "12px", color: "#555" }}>Régions</span>
            <Bar value={activeRegions.length} max={totalRegions} />
            <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{activeRegions.length}/{totalRegions}</span>
          </div>
        </Section>

        {sortedCats.length > 0 && (
          <Section title="Par catégorie">
            {sortedCats.map(([name, { count, color }]) => (
              <div key={name} style={row}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ width: "110px", fontSize: "12px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                <Bar value={count} max={maxCatCount} color={color} />
                <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{count}</span>
              </div>
            ))}
          </Section>
        )}


</div>
    </div>
  );
}

export default StatsDrawer;
