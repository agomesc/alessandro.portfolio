import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const StarComponent = ({ id }) => {
    const [count, setCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        // Obtém o contador atual do Firestore ao carregar o componente
        const fetchCount = async () => {
            const docRef = doc(db, "stars", id); // 'stars' é a coleção
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCount(docSnap.data().count || 0);
            } else {
                // Se o documento não existir, inicialize com count 0
                await setDoc(docRef, { count: 0 });
            }
        };

        fetchCount();
    }, [id]);

    const handleClick = async () => {
        const docRef = doc(db, "stars", id);

        // Incrementa o contador tanto local quanto no Firestore
        setCount((prevCount) => prevCount + 1);
        setIsClicked(true); // Define o estado como clicado

        await updateDoc(docRef, {
            count: count + 1,
        });
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
                onClick={handleClick}
                style={{
                    fontSize: "18px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: isClicked ? "gold" : "gray", // Estrela dourada se clicada, cinza caso contrário
                }}
            >
                ⭐
            </button>
            <p style={{ fontWeight: "bold", margin: 0 }}>{count}</p>
        </div>
    );
};

export default React.memo(StarComponent);