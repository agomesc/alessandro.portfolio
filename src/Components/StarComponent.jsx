// src/components/StarAverageRatingComponent.jsx
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, /* addDoc, collection, serverTimestamp */ } from "firebase/firestore"; // Removed addDoc, collection, serverTimestamp
import { getAuth } from 'firebase/auth';
// Removed: import { getItemCreatorDetails } from '../utils/itemUtils'; // Função para obter detalhes do criador

// Define o URL do avatar padrão para usuários anônimos (still here as it might be used elsewhere, but not directly for notification logic)
const DEFAULT_ANONYMOUS_AVATAR = '/images/default-avatar.png'; // <--- AJUSTE ESTE CAMINHO PARA O SEU AVATAR PADRÃO REAL

// Cálculo para a porcentagem de preenchimento da estrela
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

// SVG da estrela com preenchimento gradiente
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
    const [currentUser, setCurrentUser] = useState(null);

    const getLocalStorageUserRatingKey = useCallback((itemId) => `userStarRating_${itemId}`, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

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
                // Se o documento itemRatings não existir, crie-o.
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
            // Removed: let shouldSendNotification = false; // No longer needed

            if (previousUserRating === 0) { // Primeira avaliação
                newTotalScore += selectedRating;
                newNumVotes += 1;
                // Removed: shouldSendNotification = true;
            } else if (previousUserRating === selectedRating) { // Desfazer avaliação
                newTotalScore -= selectedRating;
                newNumVotes -= 1;
                finalSelectedRating = 0; // Marca como 'sem avaliação'
                // Removed: shouldSendNotification = false; // Não notifica ao desfazer
            } else { // Mudança de avaliação
                newTotalScore = newTotalScore - previousUserRating + selectedRating;
                // Removed: shouldSendNotification = true;
            }

            localStorage.setItem(getLocalStorageUserRatingKey(id), finalSelectedRating.toString());
            setUserRating(finalSelectedRating);

            await updateDoc(docRef, {
                totalScore: newTotalScore,
                numVotes: newNumVotes,
            });

            // --- Lógica de Notificação para Avaliações ---
            // Este bloco inteiro foi removido:
            /*
            if (shouldSendNotification) {
                const { creatorId, itemTitle } = await getItemCreatorDetails(id);
                console.log("getItemCreatorDetails result:", { creatorId, itemTitle }); // Debug log

                const senderId = currentUser ? currentUser.uid : 'anonymous';
                const senderName = currentUser ? (currentUser.displayName || 'Usuário') : 'Usuário Anônimo';
                const senderPhoto = currentUser ? (currentUser.photoURL || DEFAULT_ANONYMOUS_AVATAR) : DEFAULT_ANONYMOUS_AVATAR;

                const notificationMessage = `${senderName} avaliou seu item "${itemTitle}" com ${finalSelectedRating} estrela(s)!`;

                const finalRecipientId = creatorId || 'unknown_creator'; 

                if (finalRecipientId && (currentUser ? finalRecipientId !== currentUser.uid : true)) {
                    await addDoc(collection(db, 'notifications'), {
                        recipientId: finalRecipientId,
                        senderId: senderId,
                        senderName: senderName,
                        senderPhoto: senderPhoto,
                        type: 'rating',
                        itemId: id,
                        itemTitle: itemTitle,
                        ratingValue: finalSelectedRating,
                        message: notificationMessage,
                        timestamp: serverTimestamp(),
                        read: false,
                        link: `/item/${id}`,
                        
                        debug_originalCreatorId: creatorId,
                        debug_currentUserUid: currentUser?.uid || null,
                        debug_senderPhoto: senderPhoto
                    });
                    console.log("Notificação de avaliação enviada para:", finalRecipientId, "por:", senderName);
                } else {
                    console.log("Notificação de avaliação não enviada. Condições (para debug):", {
                        creatorId: creatorId,
                        currentUserUid: currentUser?.uid,
                        shouldSendNotification: shouldSendNotification,
                        finalRecipientId: finalRecipientId
                    });
                }
            }
            */
            // --- FIM da Lógica de Notificação ---

            setAverageRating(newNumVotes > 0 ? newTotalScore / newNumVotes : 0);

        } catch (error) {
            console.error("Erro ao lidar com o clique da estrela:", error); // Updated error message
        } finally {
            setIsProcessing(false);
        }
    }, [id, isProcessing, getLocalStorageUserRatingKey]); // Removed currentUser from dependencies as it's not used in the final version of this useCallback

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
                const currentDisplayedRating = hoverRating > 0 ? hoverRating : (userRating > 0 ? userRating : averageRating);
                const fillPercentage = getStarFillPercentage(starValue, currentDisplayedRating, hoverRating > 0);

                return (
                    <motion.button
                        key={index}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={isProcessing}
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