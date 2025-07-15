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
          console.log("Documento inicializado com sucesso!");
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
        gap: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: "15px",
        borderRadius: "15px",
        position: "relative",
        zIndex: 10,
        width: "fit-content",
        color: "white",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {followers.slice(0, 3).map((follower) => (
          <img
            key={follower.uid}
            src={follower.photoURL || "https://via.placeholder.com/30"}
            alt={follower.displayName || "Follower"}
            title={follower.displayName || "Follower"}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "2px solid gold",
            }}
          />
        ))}
        {followers.length > 3 && (
          <span style={{ fontSize: "0.8em" }}>
            + {followers.length - 3} others
          </span>
        )}
      </div>

      <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
        {followers.length} Follower{followers.length !== 1 ? "s" : ""}
      </span>

      {!currentUser ? (
        <button
          onClick={handleGoogleSignIn}
          disabled={isProcessing}
          className={shake ? "shake" : ""}
          style={{
            background: "linear-gradient(45deg, #4285F4, #34A853)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1em",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_64dp.png"
            alt="Google"
            style={{ width: "20px", height: "20px" }}
          />
          Login to Follow
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
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1em",
            fontWeight: "bold",
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {isProcessing && (
        <p style={{ fontSize: "0.8em", color: "#ccc" }}>Processing...</p>
      )}
    </div>
  );
};

export default React.memo(FollowComponent);
