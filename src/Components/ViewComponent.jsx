import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const ViewComponent = ({ id }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Garante que o código só rode no browser (evita erros com SSR)
        if (typeof window === "undefined") return;

        const registerView = async () => {
            const viewedImages = JSON.parse(localStorage.getItem("viewedImages") || "[]");
            const docRef = doc(db, "views", id);

            // Se já foi visualizado nesse browser, apenas mostra o valor atual
            if (viewedImages.includes(id)) {
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setCount(snap.data().count || 0);
                }
                return;
            }

            // Incrementa a visualização de forma segura
            const snap = await getDoc(docRef);
            if (!snap.exists()) {
                await setDoc(docRef, { count: 1 });
                setCount(1);
            } else {
                await updateDoc(docRef, { count: increment(1) });
                setCount((snap.data().count || 0) + 1);
            }

            // Marca como visualizado no localStorage
            viewedImages.push(id);
            localStorage.setItem("viewedImages", JSON.stringify(viewedImages));
        };

        registerView();
    }, [id]);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span role="img" aria-label="visualizações">👁️</span>
            <span style={{ fontWeight: "bold", fontSize: 10 }}>{count}</span>
        </div>
    );
};

export default React.memo(ViewComponent);
