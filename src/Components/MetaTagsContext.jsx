import React, { createContext, useContext, useState } from 'react';
import logo from "../images/logo_192.png"

const MetaTagsContext = createContext();

const minhaDescricao = `Me chamo Alessandro, 
		brasileiro, formado em Análise de Sistemas e pós-graduado em Engenharia de Software pela UFRJ, trabalho desde 1994 com tecnologia.
		Minha história com a fotografia começa mais ou menos assim... Minha mãe sempre fotografou, a mim e a meus irmãos, quando éramos crianças, como forma de guardar nossos momentos da infância e no ano de 2003 eu acabei ganhando a minha primeira máquina digital em um bingo numa festa de trabalho. Desde então, nunca mais me desapeguei da fotografia.
		Em 2009, depois de ser pai, acabei levando a coisa mais a sério, pois a brincadeira de fotografar minha filha acabou se tornando uma paixão e quando me dei conta, a fotografia havia ocupado uma parte significativa da minha vida. Fiz cursos de aperfeiçoamento na Canon do Brasil, no Ateliê da Imagem e na Sociedade Fluminense de Fotografia, além de ler livros nos quais pude aprender bastante.
		Hoje sou um amante da fotografia, com muito orgulho, registrando momentos importantes da vida das pessoas e o resultado dessa trajetória está refletido em meu portfólio que apresento a vocês.`;

const title = "Alessandro Portfólio"

export const MetaTagsProvider = ({ children }) => {

    const [metaTags, setMetaTags] = useState({
        title: title,
        description: minhaDescricao,
        image: `${window.location.protocol}//${window.location.host}${logo}`,
        url: window.location.href
    });

    return (
        <MetaTagsContext.Provider value={{ metaTags, setMetaTags }}>
            {children}
        </MetaTagsContext.Provider>
    );
};

export const useMetaTags = () => useContext(MetaTagsContext);
