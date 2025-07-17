import { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Tooltip,
  CircularProgress,
  Badge,
  Avatar,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
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
          <Badge badgeContent={Math.min(logs.length, 10)} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ maxWidth: 400 }}>
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
            const details = log.details || {};
            const isAvaliacao = log.actionType === 'Avaliação';
            const isComentario = log.actionType === 'Comentários';

            const notaMedia =
              details.totalScore && details.numVotes
                ? (details.totalScore / details.numVotes).toFixed(1)
                : null;

            return (
              <MenuItem key={log.id} onClick={handleClose} sx={{ alignItems: 'flex-start' }}>
                {log.userPhoto && (
                  <Avatar
                    src={log.userPhoto}
                    alt="Usuário"
                    sx={{ width: 36, height: 36, mr: 2, mt: 0.5 }}
                  />
                )}

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" component="div">
                    {isAvaliacao && notaMedia
                      ? `Avaliação recebida: nota ${notaMedia}`
                      : isComentario
                        ? (
                          <Box
                            sx={{ mt: 2, fontSize: '10px', color: '#333' }}
                            dangerouslySetInnerHTML={{
                              __html: (details.text?.slice(0, 30) || '') + '...'
                            }}
                          />
                        )
                        : log.actionType}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {log.timestamp?.toDate
                      ? format(log.timestamp.toDate(), 'dd/MM/yyyy HH:mm')
                      : 'Sem data'}
                  </Typography>
                </Box>

                {log.url && (
                  <Tooltip title="Abrir link do usuário">
                    <IconButton
                      component="a"
                      href={log.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ ml: 1, mt: 1 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
