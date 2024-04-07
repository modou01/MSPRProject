const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// le dossier public comme dossier statique
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
