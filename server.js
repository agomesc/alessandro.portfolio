const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");

const pathToIndex = path.join(__dirname, "build/index.html");
app.get("/", (req, res) => {
    const raw = fs.readFileSync(pathToIndex, 'utf8'); // Adiciona o 'utf8' para ler como string
    const pageTitle = "Homepage - Welcome to my page";
    const updated = raw.replace("__PAGE_META__", `<title>${pageTitle}</title>`);
    res.send(updated);
});

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "build/index.html"))
);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
