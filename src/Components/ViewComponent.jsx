import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const ViewComponent = ({ id }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const registerView = async () => {
            const viewedImages = JSON.parse(localStorage.getItem("viewedImages") || "[]");

            const docRef = doc(db, "views", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCount(docSnap.data().count || 0);
            } else {
                await setDoc(docRef, { count: 0 });
                setCount(0);
            }

            // Se ainda não visualizou essa imagem, incrementa o contador
            if (!viewedImages.includes(id)) {
                const updatedCount = (docSnap.data()?.count || 0) + 1;
                await updateDoc(docRef, { count: updatedCount });
                setCount(updatedCount);

                viewedImages.push(id);
                localStorage.setItem("viewedImages", JSON.stringify(viewedImages));
            }
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
