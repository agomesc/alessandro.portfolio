import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const ViewComponent = ({ id }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const registerView = async () => {
      const now = Date.now();
      const EXPIRATION_TIME = 3600000; // 1 hora em milissegundos
      const stored = JSON.parse(localStorage.getItem("viewedImages") || "{}");

      const lastViewTime = stored[id];
      if (lastViewTime && now - lastViewTime < EXPIRATION_TIME) {
        // Já foi visualizado recentemente
        const snap = await getDoc(doc(db, "views", id));
        if (snap.exists()) {
          setCount(snap.data().count || 0);
        }
        return;
      }

      const docRef = doc(db, "views", id);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        await setDoc(docRef, { count: 1 });
        setCount(1);
      } else {
        await updateDoc(docRef, { count: increment(1) });
        setCount((snap.data().count || 0) + 1);
      }

      // Salva a hora atual como última visualização
      stored[id] = now;
      localStorage.setItem("viewedImages", JSON.stringify(stored));
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
