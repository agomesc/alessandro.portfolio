import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { readFile } from "fs/promises";
import fetch from 'node-fetch';

// Definindo __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REACT_APP_FLICKR_API_KEY = "099c9a89c04c78ec7592650af1d25a7a";
const REACT_APP_USER_ID = "186526131@N04";
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", async (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  try {
    let data = await readFile(filePath, "utf8");
    data = data
      .replace(/__TITLE__/g, "Home Page")
      .replace(/__DESCRIPTION__/g, "Home page description.");

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error reading the file");
  }
});

app.get("/getList", async (req, res) => {
  try {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${REACT_APP_FLICKR_API_KEY}&user_id=${REACT_APP_USER_ID}&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('getList ', data);

    res.json(data);
  } catch (error) {
    console.error('Erro ao pegar a getList: ', error);
    res.status(500).json({ error: 'Erro ao pegar a getList' });
  }
});

app.get("/getPhotos/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${REACT_APP_FLICKR_API_KEY}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('getPhotos ', data);

    res.json(data);
  } catch (error) {
    console.error('Erro ao pegar as fotos: ', error);
    res.status(500).json({ error: 'Erro ao pegar as fotos' });
  }
});

app.get("/getLatestPhotos", async (req, res) => {
  try {
    const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${REACT_APP_FLICKR_API_KEY}&user_id=${REACT_APP_USER_ID}&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('getList ', data);

    res.json(data);
  } catch (error) {
    console.error('Erro ao pegar a getList: ', error);
    res.status(500).json({ error: 'Erro ao pegar a getList' });
  }
});

app.get("/getInfo/:photoId", async (req, res) => {
  try {
    const { photoId } = req.params;
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${REACT_APP_FLICKR_API_KEY}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('photoId ', data);

    res.json(data);
  } catch (error) {
    console.error('Erro ao pegar as informações da foto: ', error);
    res.status(500).json({ error: 'Erro ao pegar as informações da foto' });
  }
});

app.use(express.static(path.resolve(__dirname, "./build")));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
