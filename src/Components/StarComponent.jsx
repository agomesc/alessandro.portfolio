import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth'; // Keep getAuth for logged-in users
import { getItemCreatorDetails } from '../utils/itemUtils';

// Define a default anonymous avatar URL
const DEFAULT_ANONYMOUS_AVATAR = '/path/to/your/default-avatar.png'; // <-- ADJUST THIS PATH

// Cálculo de porcentagem da estrela
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

// SVG de estrela com preenchimento gradiente
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
  const [userRating, setUserRating] = useState(0); // This will now store the rating from localStorage (anonymous or logged-in)
  const [hoverRating, setHoverRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Keep track of current user for notifications and specific display

  const getLocalStorageUserRatingKey = (itemId) => `userStarRating_${itemId}`;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Always try to load user's previous rating from local storage
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
        // Initialize the document if it doesn't exist, preventing "no document to update" error
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
        const newDocSnap = await getDoc(docRef);
        if (newDocSnap.exists()) {
          const data = newDocSnap.data();
          currentTotalScore = data.totalScore || 0;
          currentNumVotes = data.numVotes || 0;
        }
      }

      setShake(true);
      setTimeout(() => setShake(false), 300);

      let newTotalScore = currentTotalScore;
      let newNumVotes = currentNumVotes;
      let finalSelectedRating = selectedRating;
      let shouldSendNotification = false;

      if (previousUserRating === 0) {
        // New rating (either anonymous or logged in)
        newTotalScore += selectedRating;
        newNumVotes += 1;
        shouldSendNotification = true;
      } else if (previousUserRating === selectedRating) {
        // Unrating: Clicked the same star again, so remove the rating
        newTotalScore -= selectedRating;
        newNumVotes -= 1;
        finalSelectedRating = 0; // User is effectively un-rating
        shouldSendNotification = false; // Don't send notification for un-rating
      } else {
        // Re-rating: Change existing rating
        newTotalScore = newTotalScore - previousUserRating + selectedRating;
        shouldSendNotification = true;
      }

      // Store the rating in local storage, regardless of login status
      localStorage.setItem(getLocalStorageUserRatingKey(id), finalSelectedRating.toString());
      setUserRating(finalSelectedRating);

      await updateDoc(docRef, {
        totalScore: newTotalScore,
        numVotes: newNumVotes,
      });

      // --- Notification Logic for Ratings ---
      if (shouldSendNotification) {
        const { creatorId, itemTitle } = await getItemCreatorDetails(id);

        // Determine sender details for the notification
        const senderId = currentUser ? currentUser.uid : 'anonymous'; // Use 'anonymous' for non-logged in users
        const senderName = currentUser ? (currentUser.displayName || 'Usuário') : 'Usuário Anônimo';
        const senderPhoto = currentUser ? (currentUser.photoURL || DEFAULT_ANONYMOUS_AVATAR) : DEFAULT_ANONYMOUS_AVATAR;

        // Ensure creatorId is valid and not the current logged-in user (avoid self-notification for logged-in users)
        // Anonymous users will always send a notification to the creator
        if (creatorId && (currentUser ? creatorId !== currentUser.uid : true)) {
          await addDoc(collection(db, 'notifications'), {
            recipientId: creatorId, // The user who owns the item being rated
            senderId: senderId,
            senderName: senderName,
            senderPhoto: senderPhoto,
            type: 'rating',
            itemId: id,
            itemTitle: itemTitle,
            ratingValue: finalSelectedRating,
            timestamp: Date.now(),
            read: false,
            link: `/item/${id}`, // Example link
          });
          console.log("Rating notification sent to:", creatorId, "by:", senderName); // Debug log
        } else {
          console.log("Rating notification not sent. Conditions:", { creatorId, currentUserUid: currentUser?.uid, shouldSendNotification }); // Debug log
        }
      }
      // --- END Notification ---

      setAverageRating(newNumVotes > 0 ? newTotalScore / newNumVotes : 0);

    } catch (error) {
      console.error("Error handling star click or sending notification:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false);
    }
  }, [id, isProcessing, currentUser]); // currentUser is still a dependency for notification sender details

  const shakeAnimation = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.3 },
    },
    still: { x: 0 },
  };

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
        // Display user's own rating if available, otherwise the average
        const currentDisplayedRating = hoverRating > 0 ? hoverRating : (userRating > 0 ? userRating : averageRating);
        const fillPercentage = getStarFillPercentage(starValue, currentDisplayedRating, hoverRating > 0);

        return (
          <motion.button
            key={index}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={isProcessing} // Removed !currentUser from disabled
            animate={shake ? "shake" : "still"}
            variants={shakeAnimation}
            aria-label={`${starValue} estrela${starValue > 1 ? "s" : ""}`}
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
          </motion.button>
        );
      })}
      {/* Display the average rating */}
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
  );
};

export default React.memo(StarAverageRatingComponent);