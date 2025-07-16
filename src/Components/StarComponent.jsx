import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { logUserAction } from '../shared/firebase-logger';
import { getAuth } from 'firebase/auth';

const getStarFillPercentage = (starValue, currentRating, isHovering) => {
  if (isHovering) {
    return starValue <= currentRating ? 100 : 0;
  } else {
    const floorRating = Math.floor(currentRating);
    const fractionalPart = currentRating - floorRating;

    if (starValue <= floorRating) return 100;
    if (starValue === floorRating + 1) return fractionalPart * 100;
    return 0;
  }
};

const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

const Star = ({ fill = 100, index }) => {
  const gradientId = `grad-${index}-${fill}`;
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${fill}%`} stopColor="gold" />
          <stop offset={`${fill}%`} stopColor="white" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2
           9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
};

const StarAverageRatingComponent = ({ id }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  // Removed setCurrentUser since it is not used

  const getLocalStorageUserRatingKey = useCallback((itemId) => `userStarRating_${itemId}`, []);

  // Removed useEffect for setCurrentUser as it was unused

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
  }, [id, getLocalStorageUserRatingKey]);

  const handleStarClick = useCallback(async (selectedRating) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const docRef = doc(db, "itemRatings", id);
    let currentTotalScore = 0;
    let currentNumVotes = 0;
    let previousUserRating = parseInt(localStorage.getItem(getLocalStorageUserRatingKey(id)) || "0", 10);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        currentTotalScore = data.totalScore || 0;
        currentNumVotes = data.numVotes || 0;
      } else {
        await setDoc(docRef, { totalScore: 0, numVotes: 0 });
      }

      setShake(true);
      setTimeout(() => setShake(false), 300);

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

      const auth = getAuth();
      const currentUser = auth.currentUser;
      const ipAddress = await getUserIP();
      const timestamp = new Date().toISOString();

      await updateDoc(docRef, {
        totalScore: newTotalScore,
        numVotes: newNumVotes,
        details: {
          totalScore: newTotalScore,
          numVotes: newNumVotes,
          user: currentUser ? currentUser.uid : null,
          ip: ipAddress,
          ratedAt: timestamp,
        },
      });

      logUserAction('Avaliação', {
        elementId: id,
        details: {
          totalScore: newTotalScore,
          numVotes: newNumVotes,
          user: currentUser ? currentUser.uid : null,
          ip: ipAddress,
          ratedAt: timestamp,
        },
      });

      setAverageRating(newNumVotes > 0 ? newTotalScore / newNumVotes : 0);

    } catch (error) {
      console.error("Erro ao lidar com o clique da estrela:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [id, isProcessing, getLocalStorageUserRatingKey]);


  return (
    <>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .shake {
          animation: shake 0.3s;
        }
      `}</style>

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
          const currentDisplayedRating = hoverRating > 0 ? hoverRating : (userRating > 0 ? userRating : averageRating);
          const fillPercentage = getStarFillPercentage(starValue, currentDisplayedRating, hoverRating > 0);

          return (
            <button
              key={index}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={isProcessing}
              aria-label={`${starValue} estrela${starValue > 1 ? "s" : ""}`}
              className={shake ? "shake" : ""}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
              }}
            >
              <Star fill={fillPercentage} index={index} />
            </button>
          );
        })}
        {averageRating > 0 && (
          <span style={{
            marginLeft: "8px",
            color: "white",
            fontSize: "0.9em",
            fontWeight: "bold",
          }}>
            {averageRating.toFixed(1)}
          </span>
        )}
      </div>
    </>
  );
};

export default React.memo(StarAverageRatingComponent);
