import { useEffect, useState } from "react";

/**
 * Affiche un toast en bas de l'écran quand un badge est débloqué.
 * Traite les badges en file d'attente (un à la fois).
 */
function BadgeToast({ badges, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const current = badges[0];

  useEffect(() => {
    if (!current) return;
    setVisible(false);
    const showTimer  = setTimeout(() => setVisible(true),  50);
    const hideTimer  = setTimeout(() => setVisible(false), 3600);
    const dismissTimer = setTimeout(() => onDismiss(),     4000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(dismissTimer);
    };
  }, [current?.id]);

  if (!current) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "white",
      borderRadius: "14px",
      boxShadow: "0 6px 28px rgba(0,0,0,0.2)",
      padding: "14px 22px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.35s ease",
      pointerEvents: "none",
      fontFamily: "Arial",
      minWidth: "260px",
      border: "1.5px solid #f0e6ff",
    }}>
      <div style={{ fontSize: "38px", lineHeight: 1 }}>🏅</div>
      <div>
        <div style={{ fontSize: "10px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>
          Badge débloqué !
        </div>
        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#2e1e69" }}>
          {current.label}
        </div>
        <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>
          {current.description}
        </div>
      </div>
    </div>
  );
}

export default BadgeToast;
