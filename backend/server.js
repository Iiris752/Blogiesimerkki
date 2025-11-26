const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Palvelinasetukset
app.use(cors());
app.use(express.json());

//polku fronttikansioon
app.use(express.static(path.join(__dirname, '../frontend')));

const DATA_FILE = path.join(__dirname, 'posts.json');

// Postausten haku:
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(posts);
});

// UUden postauksen lisäämismahdollisuus:
app.post('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newPost = { id: Date.now(), title: req.body.title, content: req.body.content };
    posts.push(newPost);
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
    res.json(newPost);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
