/**
 * Panneau flottant pour gérer les catégories de voyage :
 * affichage, suppression, et ajout d'une nouvelle catégorie.
 */
function CategoryManager({ categories, onAdd, onDelete }) {
  return (
    <div style={{
      position: "absolute",
      top: "185px",
      right: "12px",
      zIndex: 1000,
      background: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      width: "250px",
      fontFamily: "Arial",
    }}>
      <h4 style={{ margin: "0 0 10px 0" }}>Types de voyages</h4>

      {/* Liste des catégories existantes */}
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 15px 0",
        maxHeight: "150px",
        overflowY: "auto",
      }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: cat.color,
                marginRight: "8px",
                flexShrink: 0,
              }} />
              <span>{cat.name}</span>
            </div>
            <button
              onClick={() => onDelete(cat.id)}
              style={{
                background: "transparent",
                color: "#999",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "0 5px",
              }}
            >
              &times;
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>
            Aucune catégorie.
          </li>
        )}
      </ul>

      {/* Formulaire d'ajout */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <div style={{ fontSize: "12px", marginBottom: "5px" }}>Nouveau type :</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAdd(e.target.catName.value, e.target.catColor.value);
            e.target.reset();
          }}
        >
          <input
            name="catName"
            placeholder="Ex: Roadtrip..."
            style={{ width: "60%", marginRight: "5px", padding: "4px" }}
            required
          />
          <input
            name="catColor"
            type="color"
            defaultValue="#ff0000"
            style={{
              width: "20%",
              height: "26px",
              border: "none",
              verticalAlign: "bottom",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "8px",
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "5px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default CategoryManager;