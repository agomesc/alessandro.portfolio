require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
require('@babel/polyfill');
require('ignore-styles');

const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const { StaticRouter } = require('react-router-dom/server');
const App = require('./src/App').default;

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/*', (req, res) => {
  console.log(`Received request for ${req.url}`);

  const context = {};
  let appString;

  try {
    appString = ReactDOMServer.renderToString(
      React.createElement(StaticRouter, { location: req.url, context: context },
        React.createElement(App)
      )
    );
  } catch (error) {
    console.error('Erro ao renderizar no servidor:', error);
    return res.status(500).send('Erro interno do servidor');
  }

  const helmet = Helmet.renderStatic();

  const indexFile = path.resolve('./build/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo', err);
      return res.status(500).send('Ocorreu um erro interno');
    }

    let updated = data.replace('<div id="root"></div>', `<div id="root">${appString}</div>`);
    console.log('HTML atualizado:', updated);
    updated = updateHtmlContent(updated, helmet);

    console.log('Enviando resposta atualizada');
    return res.send(updated);
  });
});

function updateHtmlContent(appString, helmet) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      </head>
      <body>
        <div id="root">${appString}</div>
      </body>
    </html>
  `;
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
