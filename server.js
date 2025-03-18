const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, 'build');

// Servir arquivos estáticos
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');

  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao carregar o index.html');
    }

    // Modifica dinamicamente a meta tag description
    const modifiedHtml = data.replace(
      /<meta name="description" content=".*?">/,
      '<meta name="description" content="Descrição dinâmica via Express">'
    );

    res.send(modifiedHtml);
  });
});

// Exporta a função para o Firebase Functions
exports.app = functions.https.onRequest(app);
