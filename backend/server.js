//Node js moduulit
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

//alustusta tähän
const app = express()
const port = 4000;

//palvelinasetuksia
app.use(cors());
app.use(express.json());

//polku fronttikansioon:
app.use(express.static(path.join(__dirname, '../frontend')));

//kerrotaan palvelimelle, missä sijaitsee blogipostaukset
const DataFile = path.join(__dirname, 'posts.json');

//postausten hakeminen
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(DataFile, 'utf8'));
    res.json(posts)
})

//uuden postauksen lisäämisen mahdollisuus
app.post('/posts', (req,res) => {
    const posts = JSON.parse(fs.readFileSync(DataFile, 'utf8'));
    const newPost = {postID: Date.now(), title: req.body.title, text: req.body.text};
    posts.push(newPost);
    fs.writeFileSync(DataFile, JSON.stringify(posts,null,2));
    res.json(newPost);
})

//kommentin lisäämisen mahdollisuus
app.post('/posts/:id/comments', (req,res) => {
    const posts = JSON.parse(fs.readFileSync(DataFile, 'utf-8'));
    const postID = parseInt(req.params.id);
    const post = posts.find(p => p.postID === postID);

    if(!post) return res.status(404).json({error:'Post not found'});

    const newComment = { commentID: Date.now(), text: req.body.text };
    post.comments = post.comments || [];
    post.comments.push(newComment);

    fs.writeFileSync(DataFile, JSON.stringify(posts, null, 2));
    res.json(newComment);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));