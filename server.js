require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
require('@babel/polyfill');

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
  const context = {};
  const appString = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const helmet = Helmet.renderStatic();

  const indexFile = path.resolve('./build/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo', err);
      return res.status(500).send('Ocorreu um erro interno');
    }

    let updated = data.replace('<div id="root"></div>', `<div id="root">${appString}</div>`);
    updated = updateHtmlContent(updated, helmet);

    return res.send(updated);
  });
});

function updateHtmlContent(app, helmet) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${app}</div>
      </body>
    </html>
  `;
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
