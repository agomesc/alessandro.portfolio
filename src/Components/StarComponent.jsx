import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Helper para calcular a porcentagem de preenchimento de uma estrela individual
const getStarFillPercentage = (starValue, currentRating, isHovering) => {
  if (isHovering) {
    return starValue <= currentRating ? 100 : 0;
  } else {
    const floorRating = Math.floor(currentRating);
    const fractionalPart = currentRating - floorRating;

    if (starValue <= floorRating) {
      return 100;
    } else if (starValue === floorRating + 1) {
      return fractionalPart * 100;
    } else {
      return 0;
    }
  }
};

const StarAverageRatingComponent = ({ id }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const getLocalStorageUserRatingKey = (itemId) => `userStarRating_${itemId}`;

  useEffect(() => {
    const fetchData = async () => {
      const storedUserRating = parseInt(localStorage.getItem(getLocalStorageUserRatingKey(id)) || "0", 10);
      setUserRating(storedUserRating);

      const docRef = doc(db, "itemRatings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const totalScore = data.totalScore || 0;
        const numVotes = data.numVotes || 0;
        setAverageRating(numVotes > 0 ? totalScore / numVotes : 0);
      } else {
        await setDoc(docRef, { totalScore: 0, numVotes: 0 });
        setAverageRating(0);
      }
    };

    fetchData();
  }, [id]);

  const handleStarClick = useCallback(async (selectedRating) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const docRef = doc(db, "itemRatings", id);
    const docSnap = await getDoc(docRef);

    let currentTotalScore = 0;
    let currentNumVotes = 0;

    if (docSnap.exists()) {
      const data = docSnap.data();
      currentTotalScore = data.totalScore || 0;
      currentNumVotes = data.numVotes || 0;
    }

    setShake(true);
    setTimeout(() => setShake(false), 300);

    const previousUserRating = parseInt(localStorage.getItem(getLocalStorageUserRatingKey(id)) || "0", 10);

    let newTotalScore = currentTotalScore;
    let newNumVotes = currentNumVotes;
    let finalSelectedRating = selectedRating;

    if (previousUserRating === 0) {
      newTotalScore += selectedRating;
      newNumVotes += 1;
    } else if (previousUserRating === selectedRating) {
      newTotalScore -= selectedRating;
      newNumVotes -= 1;
      finalSelectedRating = 0;
    } else {
      newTotalScore = newTotalScore - previousUserRating + selectedRating;
    }

    localStorage.setItem(getLocalStorageUserRatingKey(id), finalSelectedRating.toString());
    setUserRating(finalSelectedRating);

    await updateDoc(docRef, {
      totalScore: newTotalScore,
      numVotes: newNumVotes,
    });

    setAverageRating(newNumVotes > 0 ? newTotalScore / newNumVotes : 0);
    setIsProcessing(false);
  }, [id, isProcessing]);

  const shakeAnimation = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.3 },
    },
    still: {
      x: 0,
    },
  };

  // Definindo um tamanho de estrela base para consistência
  const starSize = '1.2em'; // Ajuste este valor se 18px for muito pequeno ou grande

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: "4px 8px",
        borderRadius: "12px",
        position: "relative",
        zIndex: 10,
        width: "fit-content",
      }}
    >
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const currentDisplayedRating = hoverRating > 0 ? hoverRating : averageRating;
        const fillPercentage = getStarFillPercentage(starValue, currentDisplayedRating, hoverRating > 0);

        return (
          <motion.button
            key={index}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={isProcessing}
            aria-label={`${starValue} estrela${starValue > 1 ? "s" : ""}`}
            animate={shake ? "shake" : "still"}
            variants={shakeAnimation}
            style={{
              // O botão em si não precisa de fontSize, apenas seus filhos
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              position: 'relative',
              width: starSize, // Tamanho do botão igual ao da estrela
              height: starSize, // Tamanho do botão igual ao da estrela
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden', // Importante para o corte da estrela dourada
            }}
          >
            {/* Contêiner da estrela individual para garantir alinhamento */}
            <span
              style={{
                position: 'relative', // Contêiner para as estrelas absolutas
                display: 'block', // Garante que o span ocupe o espaço
                width: '100%',
                height: '100%',
                lineHeight: '1', // Centraliza o emoji verticalmente
                textAlign: 'center', // Centraliza o emoji horizontalmente
                fontSize: starSize, // Aplica o tamanho da fonte diretamente aqui
              }}
            >
              {/* ESTRELA BASE (CONTORNO / VAZIA) */}
              <span
                style={{
                  position: 'absolute',
                  top: '50%', 
                  left: '50%',
                  transform: 'translate(-50%, -50%)', // Ajusta para o centro exato
                  color: 'white',
                }}
                aria-hidden="true"
              >
                ☆ {/* Caractere de estrela com contorno */}
              </span>

              {/* ESTRELA PREENCHIDA (DOURADA) */}
              {fillPercentage > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%', // Move para o centro
                    left: '50%', // Move para o centro
                    transform: 'translate(-50%, -50%)', // Ajusta para o centro exato
                    width: `${fillPercentage}%`, // Controla o preenchimento
                    overflow: 'hidden',
                    color: 'gold',
                    fontWeight:'bold'
                  }}
                >
                  <span aria-hidden="true">☆</span> {/* Caractere de estrela preenchida */}
                </div>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default React.memo(StarAverageRatingComponent);