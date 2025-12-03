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

    //  MÄÄRITELLÄÄN miten aika näytetään, kun lisätään myöh.aikaleima kommenttiin
    const date = new Date;
    const formtDate = date.toLocaleDateString('fi-FI');
    const formtTime = date.toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const newComment = {
        commentID: Date.now(),
        text: req.body.text,
        //lisätään myös aikaleima
        timestamp: `${formtDate} klo ${formtTime}`
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);

    fs.writeFileSync(DataFile, JSON.stringify(posts, null, 2));
    res.json(newComment);
})

//kommentin poisto:
app.delete('/posts/:postID/comments/:commentID', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(DataFile, 'utf-8'));
    const postID = parseInt(req.params.postID);
    const commentID = parseInt(req.params.commentID);

    const post = posts.find(p => p.postID === postID);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments = post.comments.filter(c => c.commentID !== commentID);

    fs.writeFileSync(DataFile, JSON.stringify(posts, null, 2));
    res.json({ success: true });
})

//postauksen poisto:
app.delete('/posts/:postID', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(DataFile, 'utf-8'));
    const postID = parseInt(req.params.postID);

    const updatePosts = posts.filter(d => d.postID !== postID);

    fs.writeFileSync(DataFile, JSON.stringify(updatePosts, null, 2));
    res.json({ success: true});
});



app.listen(port, () => console.log(`Server running on http://localhost:${port}`));