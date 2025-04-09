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

        if (isClicked) {
            setCount((prev) => {
                const updated = prev - 1;
                updateDoc(docRef, { count: updated });
                return updated;
            });

            const updatedImages = clickedImages.filter((imageId) => imageId !== id);
            localStorage.setItem("clickedImages", JSON.stringify(updatedImages));
            setIsClicked(false);
        } else {
            setCount((prev) => {
                const updated = prev + 1;
                updateDoc(docRef, { count: updated });
                return updated;
            });

            clickedImages.push(id);
            localStorage.setItem("clickedImages", JSON.stringify(clickedImages));
            setIsClicked(true);
        }

        setIsProcessing(false);
    };

    return (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <button
                onClick={handleClick}
                disabled={isProcessing}
                aria-pressed={isClicked}
                aria-label={isClicked ? "Remover estrela" : "Adicionar estrela"}
                style={{
                    fontSize: "14px",
                    background: "none",
                    border: "none",
                    cursor: isClicked ? "not-allowed" : "pointer",
                    color: isClicked ? "gold" : "gray",
                    transition: "transform 0.1s",
                }}
            >
                <span role="img" aria-hidden="true">⭐</span>
            </button>
            <span style={{ fontWeight: "bold", fontSize: 10 }}>{count}</span>
        </div>
    );
};

export default React.memo(StarComponent);
