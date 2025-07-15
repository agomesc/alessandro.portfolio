// src/hooks/useScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollToTop() {
  const { pathname } = useLocation(); // Obtém o caminho atual da URL

  useEffect(() => {
    // Rola a janela para o topo (coordenadas x=0, y=0)
    window.scrollTo(0, 0);
  }, [pathname]); // Este efeito será re-executado sempre que o 'pathname' (rota) mudar
}

export default useScrollToTop;