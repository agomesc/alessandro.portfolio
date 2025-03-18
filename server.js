const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, 'build');

// Não defina o express.static antes do código que modifica o HTML
app.get('/', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');

    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao carregar o index.html');
        }

        // Modifica dinamicamente a meta tag description
        const modifiedHtml = data.replace(
            /<meta name="description" content=".*?">/,
            '<title>Alterado com sucsso!</title>',
            '<meta name="description" content="Descrição dinâmica via Express">'
        );

        res.send(modifiedHtml);
    });
});

// Agora defina express.static após o código de modificação
app.use(express.static(buildPath));

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
