import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemText,
  Divider,
  Tooltip,
  CircularProgress,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import format from 'date-fns/format';

const NotificationsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const q = query(
      collection(db, 'logs_usuarios'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(items);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar logs:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={logs.length} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography sx={{ px: 2, py: 1 }} variant="subtitle1">
          Notificações
        </Typography>
        <Divider />
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
          </MenuItem>
        ) : logs.length === 0 ? (
          <MenuItem disabled>Nenhuma notificação</MenuItem>
        ) : (
          logs.slice(0, 10).map((log) => {
            const isAvaliacao = log.actionType === 'Avaliação';
            const details = log.details || {};
            const notaMedia =
              details.totalScore && details.numVotes
                ? (details.totalScore / details.numVotes).toFixed(1)
                : null;

            return (
              <MenuItem key={log.id} onClick={handleClose}>
                <ListItemText
                  primary={
                    isAvaliacao && notaMedia
                      ? `Avaliação recebida: nota ${notaMedia}`
                      : log.actionType
                  }
                  secondary={
                    log.timestamp?.toDate
                      ? format(log.timestamp.toDate(), 'dd/MM/yyyy HH:mm')
                      : 'Sem data'
                  }
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
