import React, { useState, useEffect, useCallback } from "react";
import { db, auth, provider } from "../firebaseConfig"; // Import auth and googleProvider
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion"; // Assuming you want similar animation

const FollowComponent = ({ entityId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch follower data
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
        // Initialize the document if it doesn't exist
        await updateDoc(docRef, { followerUsers: [] }, { merge: true });
        setFollowers([]);
        setIsFollowing(false);
      }
    };

    fetchFollowers();
  }, [entityId, currentUser]); // Re-fetch when entityId or currentUser changes

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // User is now logged in, useEffect will handle updating currentUser and fetching data
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleFollowToggle = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!currentUser) {
      // Prompt user to log in if not already
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
        // Unfollow
        await updateDoc(docRef, {
          followerUsers: arrayRemove(userToToggle),
        });
        setFollowers((prev) =>
          prev.filter((follower) => follower.uid !== currentUser.uid)
        );
        setIsFollowing(false);
      } else {
        // Follow
        await updateDoc(docRef, {
          followerUsers: arrayUnion(userToToggle),
        });
        setFollowers((prev) => [...prev, userToToggle]);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [entityId, currentUser, isFollowing, isProcessing]);

  const shakeAnimation = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.3 },
    },
    still: { x: 0 },
  };

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Follower Avatars */}
        {followers.slice(0, 3).map((follower) => (
          <img
            key={follower.uid}
            src={follower.photoURL || "https://via.placeholder.com/30"} // Placeholder if no photoURL
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

      {/* Follower Count */}
      <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
        {followers.length} Follower{followers.length !== 1 ? "s" : ""}
      </span>

      {/* Follow/Login Button */}
      {!currentUser ? (
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={isProcessing}
          animate={shake ? "shake" : "still"}
          variants={shakeAnimation}
          style={{
            background: "linear-gradient(45deg, #4285F4, #34A853)", // Google colors
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
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_64dp.png" // Google icon
            alt="Google"
            style={{ width: "20px", height: "20px" }}
          />
          Login to Follow
        </motion.button>
      ) : (
        <motion.button
          onClick={handleFollowToggle}
          disabled={isProcessing}
          animate={shake ? "shake" : "still"}
          variants={shakeAnimation}
          style={{
            background: isFollowing
              ? "linear-gradient(45deg, #FF6B6B, #FFB86B)" // Unfollow color
              : "linear-gradient(45deg, #4CAF50, #8BC34A)", // Follow color
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
        </motion.button>
      )}
      {isProcessing && (
        <p style={{ fontSize: "0.8em", color: "#ccc" }}>Processing...</p>
      )}
    </div>
  );
};

export default React.memo(FollowComponent);