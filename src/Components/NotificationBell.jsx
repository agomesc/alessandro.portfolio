import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Badge, Box, Typography, Avatar, Button, Paper, ClickAwayListener } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkAsReadIcon from '@mui/icons-material/DoneAll'; // Icon for marking all as read
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, writeBatch } from 'firebase/firestore'; // Import writeBatch
import { getAuth } from 'firebase/auth'; // To get the current user's ID

// Helper to format timestamps (you can create a more robust one)
const formatTimestamp = (timestamp) => {
  // Ensure timestamp is a valid Firebase Timestamp or Date object
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const notificationsRef = useRef(null); // Ref for the notification dropdown

  // Fetch current user on mount
  useEffect(() => {
    console.log("Auth effect running...");
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      console.log("Current user changed:", user ? user.uid : "No user");
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen for notifications for the current user
  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, clearing notifications.");
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    console.log("Listening for notifications for user:", currentUser.uid);
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
      console.log("Fetched notifications:", fetchedNotifications);
      console.log("Unread count:", fetchedNotifications.filter(n => !n.read).length);
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);


  // Handler functions and derived state should be defined here, before the return statement
  const handleClick = (event) => {
    const newStateOpen = !Boolean(anchorEl); // Determine the state *before* setting it
    setAnchorEl(anchorEl ? null : event.currentTarget);
    console.log("Bell clicked, open state:", newStateOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("ClickAway, closing dropdown.");
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log("Attempting to mark notification as read:", notificationId);
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
      console.log("Notification marked as read successfully:", notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser || notifications.length === 0) {
      console.log("No user or no notifications to mark all as read.");
      return;
    }

    try {
      console.log("Attempting to mark all notifications as read for user:", currentUser.uid);
      const batch = writeBatch(db); // Use writeBatch from 'firebase/firestore'
      notifications.forEach(notif => {
        if (!notif.read) {
          const notifRef = doc(db, 'notifications', notif.id);
          batch.update(notifRef, { read: true });
        }
      });
      await batch.commit();
      console.log("All notifications marked as read successfully.");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Derived state for rendering
  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-describedby={id} // `id` is now defined
          onClick={handleClick}
          color="inherit" // Adjust color to match your header/menu
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {open && (
          <Paper
            ref={notificationsRef}
            sx={{
              position: 'absolute',
              top: '100%', // Position below the bell icon
              right: 0,
              width: 300, // Fixed width for the dropdown
              maxHeight: 400, // Max height with scroll
              overflowY: 'auto',
              mt: 1, // Margin top
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 1000, // Ensure it's above other content
              p: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" sx={{ ml: 1 }}>
                Notificações
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={handleMarkAllAsRead} startIcon={<MarkAsReadIcon />}>
                  Marcar todas como lidas
                </Button>
              )}
            </Box>
            <hr style={{ border: '0', borderTop: '1px solid rgba(0,0,0,0.1)', marginBottom: '8px' }} />

            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                Nenhuma notificação por enquanto.
              </Typography>
            ) : (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    mb: 1,
                    backgroundColor: notification.read ? 'white' : '#f0f2f5', // Subtle background for unread
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#e0e2e5', // Hover effect
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    // Optional: navigate to the item/comment when clicked
                    // if (notification.link) window.location.href = notification.link;
                    handleMarkAsRead(notification.id);
                  }}
                >
                  <Avatar
                    src={notification.senderPhoto || undefined} // Use undefined if null to show default avatar
                    alt={notification.senderName}
                    sx={{ width: 40, height: 40, mr: 1, flexShrink: 0 }} // Adjust size for notification list
                  >
                    {!notification.senderPhoto && <NotificationsIcon />} {/* Fallback if no photo */}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" component="div" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                      <strong>{notification.senderName}</strong>
                      {notification.type === 'comment' ? (
                        <> comentou em {notification.itemTitle ? <strong>"{notification.itemTitle}"</strong> : 'um item'}: "{notification.commentText?.substring(0, 50)}..."</>
                      ) : (
                        <> avaliou {notification.itemTitle ? <strong>"{notification.itemTitle}"</strong> : 'um item'} com {notification.ratingValue} estrela(s)</>
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {/* Check if timestamp exists and has a toDate method before calling it */}
                      {notification.timestamp ? formatTimestamp(notification.timestamp) : 'Data indisponível'}
                    </Typography>
                  </Box>
                  {!notification.read && (
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }} sx={{ ml: 1 }}>
                      <MarkAsReadIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default NotificationBell;