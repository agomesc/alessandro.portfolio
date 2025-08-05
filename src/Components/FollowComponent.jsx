import React, { useState, useEffect, useCallback } from "react";
import { db, auth, provider } from "../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

const FollowComponent = ({ entityId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      const docRef = doc(db, "followedBy", entityId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentFollowers = data.followerUsers || [];
        setFollowers(currentFollowers);

        if (currentUser) {
          const userIsFollowing = currentFollowers.some(
            (follower) => follower.uid === currentUser.uid
          );
          setIsFollowing(userIsFollowing);
        }
      } else {
        try {
          await setDoc(docRef, { followerUsers: [] }, { merge: true });
          setFollowers([]);
          setIsFollowing(false);
        } catch (error) {
          console.error("Erro ao inicializar o documento:", error);
        }
      }
    };

    fetchFollowers();
  }, [entityId, currentUser]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  const handleFollowToggle = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!currentUser) {
      handleGoogleSignIn();
      setIsProcessing(false);
      return;
    }

    setShake(true);
    setTimeout(() => setShake(false), 300);

    const docRef = doc(db, "followedBy", entityId);
    const userToToggle = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    };

    try {
      if (isFollowing) {
        await updateDoc(docRef, {
          followerUsers: arrayRemove(userToToggle),
        });
        setFollowers((prev) =>
          prev.filter((follower) => follower.uid !== currentUser.uid)
        );
        setIsFollowing(false);
      } else {
        await updateDoc(docRef, {
          followerUsers: arrayUnion(userToToggle),
        });
        setFollowers((prev) => [...prev, userToToggle]);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar o status de seguir:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [entityId, currentUser, isFollowing, isProcessing]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        width: "fit-content",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >

      <img
        src="/logo_512.png"
        alt="Olho Fotográfico"
        loading="lazy"
        style={{ height: "120px", objectFit: "contain" }}
      />

      {followers.slice(0, 3).map((follower) => (
        <img
          key={follower.uid}
          src={follower.photoURL || "https://via.placeholder.com/30"}
          alt={follower.displayName || "Follower"}
          title={follower.displayName || "Follower"}
          loading="lazy"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "2px solid gold",
          }}
        />
      ))}
      {followers.length > 3 && (
        <span style={{ fontSize: "0.9em", color: "var(--primary-color)" }}>
          + {followers.length - 3} outros
        </span>
      )}


      <span style={{ fontSize: "1.1em", fontWeight: 500, color: "var(--primary-color)" }}>
        {followers.length} Seguidor{followers.length !== 1 ? "es" : ""}
      </span>

      {!currentUser ? (
        <button
          onClick={handleGoogleSignIn}
          disabled={isProcessing}
          className={shake ? "shake" : ""}
          style={{
            background: "linear-gradient(45deg, #4285F4, #34A853)",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1em",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_64dp.png"
            alt="Google"
            style={{ width: "18px", height: "18px" }}
          />
          Siga-me
        </button>
      ) : (
        <button
          onClick={handleFollowToggle}
          disabled={isProcessing}
          className={shake ? "shake" : ""}
          style={{
            background: isFollowing
              ? "linear-gradient(45deg, #FF6B6B, #FFB86B)"
              : "linear-gradient(45deg, #4CAF50, #8BC34A)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1em",
            fontWeight: "bold",
          }}
        >
          {isFollowing ? "Deixar de seguir" : "Seguir"}
        </button>
      )}

      {isProcessing && (
        <p style={{ fontSize: "0.85em", color: "var(--primary-color)" }}>Processando...</p>
      )}
    </div>
  );
};

export default React.memo(FollowComponent);
