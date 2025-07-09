import { useState, useEffect, useCallback } from "react";
import {
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
  // deleteUser não é mais necessário se você não usa login anônimo
} from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

const useFirebaseAuth = (showMessage) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Configura a persistência da sessão para 'browserSessionPersistence'
    setPersistence(firebaseConfig.auth, browserSessionPersistence)
      .then(() => {
        // Observador do estado de autenticação
        const unsubscribe = firebaseConfig.auth.onAuthStateChanged((usr) => {
          setUser(usr);
          setLoadingAuth(false); // Autenticação inicial carregada
        });
        return unsubscribe; // Retorna a função de unsubscribe para limpeza
      })
      .catch((error) => {
        console.error("Erro ao configurar a persistência da sessão:", error);
        setAuthError(error);
        showMessage("Erro ao configurar a persistência da sessão: " + error.message, "error");
        setLoadingAuth(false); // Termina o loading mesmo com erro
      });
  }, [showMessage]);

  const handleLogin = useCallback(async () => {
    if (loadingAuth) {
      showMessage("Aguarde, verificando estado de autenticação...", "info");
      return;
    }

    if (user) {
      showMessage("Você já está logado.", "info");
      return;
    }

    if (!firebaseConfig.auth || !firebaseConfig.provider) {
      showMessage("Configuração do Firebase não está completa.", "error");
      return;
    }

    setLoadingAuth(true); // Indica que o login está em andamento
    setAuthError(null); // Limpa erros anteriores
    try {
      const result = await signInWithPopup(firebaseConfig.auth, firebaseConfig.provider);
      setUser(result.user);
      showMessage(`Bem-vindo, ${result.user.displayName || "usuário"}!`, "success");
    } catch (error) {
      setAuthError(error);
      showMessage("Erro ao fazer login: " + error.message, "error");
    } finally {
      setLoadingAuth(false); // Reseta o estado de carregamento
    }
  }, [user, loadingAuth, showMessage]);

  const handleLogout = useCallback(async () => {
    if (loadingAuth) {
      showMessage("Aguarde, verificando estado de autenticação...", "info");
      return;
    }

    if (!user) {
      showMessage("Você não está logado.", "warning");
      return;
    }

    setLoadingAuth(true); // Indica que o logout está em andamento
    setAuthError(null); // Limpa erros anteriores
    try {
      await signOut(firebaseConfig.auth); // Simplesmente chama signOut para qualquer tipo de usuário
      setUser(null); // Limpa o estado do usuário localmente
      showMessage("Desconectado com sucesso.", "info");
    } catch (error) {
      setAuthError(error);
      showMessage("Erro ao fazer logout: " + error.message, "error");
    } finally {
      setLoadingAuth(false); // Reseta o estado de carregamento
    }
  }, [user, loadingAuth, showMessage]);

  return {
    user,
    loadingAuth,
    authError,
    handleLogin,
    handleLogout,
  };
};

export default useFirebaseAuth;