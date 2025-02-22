const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    res.render('home', { posts });
});

app.get('/post', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    const post = posts.find(p => p.id == req.query.id);
    res.render('post', { post });
});

app.get('/add-post', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
    res.redirect('/posts');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/posts');
});
