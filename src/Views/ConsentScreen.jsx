import { useState } from "react";

const ConsentScreen = () => {
  const [showConsent, setShowConsent] = useState(true);

  const handleAccept = () => {
    setShowConsent(false);
    localStorage.setItem("userConsent", "accepted"); // Salva a aceitação
  };

  return (
    showConsent && (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "5px", maxWidth: "400px", textAlign: "center" }}>
          <h2>Bem-vindo ao OlhoFotográfico!</h2>
          <p>Utilizamos cookies para melhorar sua experiência e respeitamos sua privacidade. Ao continuar, você aceita nossos termos e políticas.</p>
          <button onClick={handleAccept} style={{ padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Aceitar e Continuar
          </button>
        </div>
      </div>
    )
  );
};

export default ConsentScreen;