import { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Compression image — pas de lib externe, canvas natif
// ---------------------------------------------------------------------------

/**
 * Compresse une image File en base64.
 * Redimensionne à max 800px de large et encode en JPEG qualité 0.7.
 * Résultat typique : 30-80KB par photo.
 */
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const MAX_WIDTH = 800;
    const QUALITY   = 0.7;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio  = Math.min(1, MAX_WIDTH / img.width);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ---------------------------------------------------------------------------
// Composant modal
// ---------------------------------------------------------------------------

const SEASONS = ["Printemps", "Été", "Automne", "Hiver"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

function PlaceModal({ isOpen, editIndex, initialData, categories, onSave, onClose }) {
  const [formName, setFormName]         = useState("");
  const [formComment, setFormComment]   = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPhoto, setFormPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formSeason, setFormSeason]     = useState("");
  const [formYear, setFormYear]         = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormName(initialData.name || "");
      setFormComment(initialData.comment || "");
      const matchingCategory = categories.find(c => c.name === initialData.category?.name);
      setFormCategoryId(matchingCategory ? matchingCategory.id : "");
      setFormPhoto(initialData.photo || null);
      setPhotoPreview(initialData.photo || null);
      setFormSeason(initialData.date?.season || "");
      setFormYear(initialData.date?.year ? String(initialData.date.year) : "");
    } else {
      setFormName("");
      setFormComment("");
      setFormCategoryId("");
      setFormPhoto(null);
      setPhotoPreview(null);
      setFormSeason("");
      setFormYear("");
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      setFormPhoto(compressed);
      setPhotoPreview(compressed);
    } catch (err) {
      alert("Erreur lors du chargement de l'image.");
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = () => {
    setFormPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!formName) return alert("Le nom est obligatoire");
    const selectedCat = categories.find(c => c.id == formCategoryId);
    if (!selectedCat) return alert("Sélectionnez une catégorie");

    onSave(
      {
        name: formName,
        comment: formComment,
        category: { name: selectedCat.name, color: selectedCat.color },
        photo: formPhoto || null,
        date: {
          season: formSeason || null,
          year: formYear ? parseInt(formYear) : null,
        },
      },
      editIndex
    );
  };

  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "100%", zIndex: 2000,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
    }}>
      <div style={{
        background: "white", padding: "20px", borderRadius: "8px",
        width: "340px", fontFamily: "Arial", maxHeight: "90vh", overflowY: "auto",
      }}>
        <h3 style={{ marginTop: 0 }}>
          {editIndex !== null ? "Modifier le lieu ✏️" : "Nouveau souvenir 📍"}
        </h3>

        {/* Nom */}
        <label style={labelStyle}>Nom du lieu</label>
        <input
          type="text"
          value={formName}
          onChange={e => setFormName(e.target.value)}
          style={inputStyle}
          autoFocus
        />

        {/* Commentaire */}
        <label style={labelStyle}>Commentaire</label>
        <textarea
          value={formComment}
          onChange={e => setFormComment(e.target.value)}
          placeholder="Quand ? Avec qui ? Quel souvenir ?"
          style={{ ...inputStyle, height: "60px", resize: "vertical" }}
        />

        {/* Catégorie */}
        <label style={labelStyle}>Type de voyage</label>
        <select
          value={formCategoryId}
          onChange={e => setFormCategoryId(e.target.value)}
          style={{ ...inputStyle, marginBottom: "16px" }}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Période */}
        <label style={labelStyle}>Période</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <select
            value={formSeason}
            onChange={e => setFormSeason(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          >
            <option value="">Saison oubliée</option>
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={formYear}
            onChange={e => setFormYear(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          >
            <option value="">Année oubliée</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Photo */}
        <label style={labelStyle}>Photo du souvenir</label>

        {/* Preview ou zone d'upload */}
        {photoPreview ? (
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <img
              src={photoPreview}
              alt="Aperçu"
              style={{
                width: "100%", height: "160px",
                objectFit: "cover", borderRadius: "6px",
                display: "block",
              }}
            />
            <button
              onClick={removePhoto}
              style={{
                position: "absolute", top: "6px", right: "6px",
                background: "rgba(0,0,0,0.55)", color: "white",
                border: "none", borderRadius: "50%",
                width: "26px", height: "26px",
                cursor: "pointer", fontSize: "14px", lineHeight: 1,
              }}
            >
              ✕
            </button>
            {/* Bouton changer la photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: "6px", right: "6px",
                background: "rgba(0,0,0,0.55)", color: "white",
                border: "none", borderRadius: "4px",
                padding: "3px 8px", cursor: "pointer", fontSize: "11px",
              }}
            >
              Changer
            </button>
          </div>
        ) : (
          <div
            onClick={() => !isCompressing && fileInputRef.current?.click()}
            style={{
              border: "2px dashed #ddd", borderRadius: "6px",
              padding: "20px", textAlign: "center",
              cursor: isCompressing ? "wait" : "pointer",
              marginBottom: "12px", color: "#aaa", fontSize: "13px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#2e1e69"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#ddd"}
          >
            {isCompressing ? "⏳ Compression en cours..." : "📷 Ajouter une photo"}
          </div>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Boutons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <button onClick={onClose} style={btnCancel}>Annuler</button>
          <button onClick={handleSave} style={btnSave}>
            {editIndex !== null ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles partagés
const labelStyle = { display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: "4px" };
const btnCancel  = { background: "#ccc", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" };
const btnSave    = { background: "#2e1e69", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" };

export default PlaceModal;