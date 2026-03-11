
import { useState, useEffect } from "react";

/**
 * Modal pour ajouter un nouveau lieu ou modifier un lieu existant.
 * 
 * Props :
 * - isOpen        : booléen, affiche ou masque la modal
 * - editIndex     : null (ajout) ou index (édition)
 * - initialData   : données du lieu à éditer (null si ajout)
 * - categories    : liste des catégories disponibles
 * - onSave        : callback(placeData, editIndex)
 * - onClose       : callback pour fermer sans sauvegarder
 */
function PlaceModal({ isOpen, editIndex, initialData, categories, onSave, onClose }) {
  const [formName, setFormName] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  // Pré-remplissage si édition
  useEffect(() => {
    if (initialData) {
      setFormName(initialData.name || "");
      setFormComment(initialData.comment || "");
      const matchingCategory = categories.find(
        (c) => c.name === initialData.category?.name
      );
      setFormCategoryId(matchingCategory ? matchingCategory.id : "");
    } else {
      setFormName("");
      setFormComment("");
      setFormCategoryId(categories[0]?.id || "");
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formName) return alert("Le nom est obligatoire");
    const selectedCat = categories.find((c) => c.id == formCategoryId);
    if (!selectedCat) return alert("Sélectionnez une catégorie");

    onSave(
      {
        name: formName,
        comment: formComment,
        category: { name: selectedCat.name, color: selectedCat.color },
      },
      editIndex
    );
  };

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      zIndex: 2000,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "320px",
        fontFamily: "Arial",
      }}>
        <h3 style={{ marginTop: 0 }}>
          {editIndex !== null ? "Modifier le lieu ✏️" : "Nouveau souvenir 📍"}
        </h3>

        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
          Nom du lieu
        </label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box" }}
          autoFocus
        />

        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
          Commentaire
        </label>
        <textarea
          value={formComment}
          onChange={(e) => setFormComment(e.target.value)}
          placeholder="Avec qui ? Quel souvenir ?"
          style={{ width: "100%", padding: "8px", marginBottom: "12px", height: "60px", boxSizing: "border-box" }}
        />

        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
          Type de voyage
        </label>
        <select
          value={formCategoryId}
          onChange={(e) => setFormCategoryId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{ background: "#ccc", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            style={{ background: "#2e1e69", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
          >
            {editIndex !== null ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceModal;