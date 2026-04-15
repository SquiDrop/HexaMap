import { PRESET_CHALLENGES, computeChallengeProgress } from "../hooks/useObjectives";


function ProgressBar({ percent, completed }) {
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ height: "8px", borderRadius: "4px", background: "#eee", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${percent}%`,
          borderRadius: "4px",
          background: completed ? "#27ae60" : "#2e1e69",
          transition: "width 0.4s ease",
        }} />
      </div>
      <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", textAlign: "right" }}>
        {percent}%
      </div>
    </div>
  );
}


function ChallengeCard({ challenge, progress }) {
  return (
    <div style={{
      padding: "10px 12px",
      borderRadius: "8px",
      marginBottom: "8px",
      border: progress.completed ? "1.5px solid #27ae60" : "1.5px solid #e8e8e8",
      background: progress.completed ? "#f0faf4" : "white",
      opacity: progress.completed ? 0.85 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>
            {progress.completed ? "🏅 " : ""}{challenge.label}
          </div>
          <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>
            {challenge.description}
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#555", whiteSpace: "nowrap", marginLeft: "8px" }}>
          {progress.current} / {progress.target}
        </div>
      </div>
      <ProgressBar percent={progress.percent} completed={progress.completed} />
    </div>
  );
}


const SECTION_LABELS = {
  departement: "📍 Départements",
  region:      "🗺️ Régions",
  categorie:   "🏷️ Catégories",
  geo:         "🌊 Géographiques",
};

function ObjectivesPanel({ onClose, activeDepartments, activeRegions, visitedPlaces }) {
  const stats = { activeDepartments, activeRegions, visitedPlaces };

  return (
    <div style={{
      position: "absolute",
      top: "12px",
      right: "270px",
      zIndex: 1000,
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      width: "300px",
      fontFamily: "Arial",
      display: "flex",
      flexDirection: "column",
      maxHeight: "85vh",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px 12px" }}>
        <h4 style={{ margin: 0, fontSize: "15px" }}>🎯 Défis</h4>
        <button
          onClick={onClose}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: "#999", lineHeight: 1 }}
        >
          &times;
        </button>
      </div>

      {/* Contenu scrollable */}
      <div style={{ overflowY: "auto", padding: "0 15px 15px" }}>
        {Object.keys(SECTION_LABELS).map(type => (
          <div key={type} style={{ marginBottom: "24px" }}>
            <div style={{
              fontSize: "13px", fontWeight: "bold", color: "#ff0000",
              textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px",
              borderBottom: "1px solid #f0f0f0", paddingBottom: "6px",
            }}>
              {SECTION_LABELS[type]}
            </div>
            {PRESET_CHALLENGES.filter(c => c.type === type).map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                progress={computeChallengeProgress(challenge, stats)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ObjectivesPanel;