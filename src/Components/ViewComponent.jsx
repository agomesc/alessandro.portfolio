import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const ViewComponent = ({ id }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const registerView = async () => {
      const viewedImages = JSON.parse(localStorage.getItem("viewedImages") || "[]");
      const docRef = doc(db, "views", id);

      if (viewedImages.includes(id)) {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCount(snap.data().count || 0);
        }
        return;
      }

      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, { count: 1 });
        setCount(1);
      } else {
        await updateDoc(docRef, { count: increment(1) });
        setCount((snap.data().count || 0) + 1);
      }

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
