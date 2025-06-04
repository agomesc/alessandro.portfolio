import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const StarComponent = ({ id }) => {
    const [count, setCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const clickedImages = JSON.parse(localStorage.getItem("clickedImages") || "[]");
            setIsClicked(clickedImages.includes(id));

            const docRef = doc(db, "stars", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCount(docSnap.data().count || 0);
            } else {
                await setDoc(docRef, { count: 0 });
                setCount(0);
            }
        };

        fetchData();
    }, [id]);

    const handleClick = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const clickedImages = JSON.parse(localStorage.getItem("clickedImages") || "[]");
        const docRef = doc(db, "stars", id);
        let updated = count;

        if (isClicked) {
            updated = count - 1;
            await updateDoc(docRef, { count: updated });

            const updatedImages = clickedImages.filter((imageId) => imageId !== id);
            localStorage.setItem("clickedImages", JSON.stringify(updatedImages));
            setIsClicked(false);
        } else {
            updated = count + 1;
            await updateDoc(docRef, { count: updated });

            clickedImages.push(id);
            localStorage.setItem("clickedImages", JSON.stringify(clickedImages));
            setIsClicked(true);
        }

        setCount(updated);
        setIsProcessing(false);
    };


    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                padding: "4px 8px",
                borderRadius: "12px",
                position: "relative",
                zIndex: 10,
            }}
        >
            <button
                onClick={handleClick}
                disabled={isProcessing}
                aria-pressed={isClicked}
                aria-label={isClicked ? "Remover estrela" : "Adicionar estrela"}
                style={{
                    fontSize: "18px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: isClicked ? "gold" : "white",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                }}
            >
                <span role="img" aria-hidden="true">⭐</span>
            </button>
            <span
                style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                }}
            >
                {count}
            </span>
        </div>

    );
};

export default React.memo(StarComponent);
