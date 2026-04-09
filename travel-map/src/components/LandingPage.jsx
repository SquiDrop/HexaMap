import franceBorders from "../assets/france_border.png";

function LandingPage({ onStart }) {
  return (
    <div className="landing-container">
      <style>{`
        .landing-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background-color: #fcfcfc;
        }
        .landing-container::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url('${franceBorders}');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.1;
          z-index: 0;
          background-attachment: fixed;
        }
        .hero-section, .features-section, .inspiration-section {
          position: relative;
          z-index: 1;
          background: transparent;
        }
        .hero-section {
          text-align: center;
          padding: 80px 20px;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          color: #1e88e5;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .hero-subtitle {
          font-size: 1.5rem;
          color: #555;
          margin-bottom: 40px;
        }
        .btn-start {
          background-color: #e63946;
          color: white;
          border: none;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(230, 57, 70, 0.4);
          transition: transform 0.2s;
        }
        .btn-start:hover {
          transform: scale(1.05);
        }
        .features-section {
          display: flex;
          justify-content: space-around;
          flex-wrap: nowrap;
          padding: 10px 4%;
          gap: 14px;
        }
        .feature-card {
          background: rgba(255, 255, 255, 0.9);
          padding: 18px;
          border-radius: 15px;
          flex: 1;
          min-width: 0;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }
        .inspiration-section {
          padding: 40px 10%;
          text-align: center;
        }
        .gallery {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }
        .gallery img {
          width: 300px;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>

      <header className="hero-section">
        <h1 className="hero-title">HEXAMAP</h1>
        <p className="hero-subtitle">Retracez vos voyages. Collectionnez vos souvenirs. Redécouvrez la France.</p>
        <button className="btn-start" onClick={onStart}>
          Ouvrir ma carte
        </button>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Posez vos souvenirs</h3>
          <p>Ajoutez vos lieux visités, choisissez une catégorie, une photo, une saison. Chaque souvenir à sa place sur la carte.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Colorez l'Hexagone</h3>
          <p>Regardez votre carte de France prendre vie département par département, région par région.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏅</div>
          <h3>Relevez des défis</h3>
          <p>Alpes, Pyrénées, littoral atlantique, côte méditerranéenne... Des dizaines de défis géographiques et thématiques à débloquer.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Retracez dans le temps</h3>
          <p>Associez chaque lieu à une saison et une année. Printemps 2021, été 2023 — ou juste "oublié".</p>
        </div>
      </section>

      <section className="inspiration-section">
        <h2>Tant de lieux restent à découvrir...</h2>
        <div className="gallery">
          <img src="https://images.unsplash.com/photo-1596436831831-87dd84a69101?q=80&w=1171&auto=format&fit=crop" alt="Mont Saint-Michel" />
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80" alt="Paris" />
          <img src="https://cdn.sanity.io/images/nxpteyfv/goguides/f9425b45caa8898eac9e7eba91d61aa278a28cb6-1600x1067.jpg" alt="Annecy" />
          <img src="https://www.pyrenees-trip.com/uploads/2018/06/1Cirque-de-gavarnie-Classic-2.jpg" alt="Cirque de Gavarnie" />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;