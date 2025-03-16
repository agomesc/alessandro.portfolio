import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const StarComponent = ({ id }) => {
    const [count, setCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const clickedImages = JSON.parse(localStorage.getItem("clickedImages") || "[]");

            // Verificar se o ID já foi clicado no localStorage
            setIsClicked(clickedImages.includes(id));

            // Obter o contador do Firestore
            const docRef = doc(db, "stars", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCount(docSnap.data().count || 0);
            } else {
                // Inicializa no Firestore caso não exista
                await setDoc(docRef, { count: 0 });
                setCount(0);
            }
        };

        fetchData();
    }, [id]);

    const handleClick = async () => {
        const clickedImages = JSON.parse(localStorage.getItem("clickedImages") || "[]");
        const docRef = doc(db, "stars", id);

        if (isClicked) {
            // Remove a interação e decrementar o contador
            setCount((prevCount) => prevCount - 1);
            await updateDoc(docRef, { count: count - 1 });
            const updatedImages = clickedImages.filter((imageId) => imageId !== id);
            localStorage.setItem("clickedImages", JSON.stringify(updatedImages));
            setIsClicked(false);
        } else {
            // Adiciona a interação e incrementa o contador
            setCount((prevCount) => prevCount + 1);
            await updateDoc(docRef, { count: count + 1 });
            clickedImages.push(id);
            localStorage.setItem("clickedImages", JSON.stringify(clickedImages));
            setIsClicked(true);
        }
    };

    return (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <button
                onClick={handleClick}
                style={{
                    fontSize: "14px",
                    background: "none",
                    border: "none",
                    cursor: isClicked ? "not-allowed" : "pointer",
                    color: isClicked ? "gold" : "gray",
                }}
            >
                ⭐
            </button>
            <span style={{ fontWeight: "bold", margin: 0, padding: 0, fontSize: 10 }}>{count}</span>
        </div>
    );
};

export default React.memo(StarComponent);