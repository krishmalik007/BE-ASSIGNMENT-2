const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const postsFile = "posts.json"; 


app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/posts", (req, res) => {
    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) return res.send("not able to load the post ");
        res.render("index", { posts: JSON.parse(data) });
    });
});

app.get("/post", (req, res) => {
    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) return res.send("not able to load the post");
        const post = JSON.parse(data).find(p => p.id === parseInt(req.query.id));
        post ? res.render("post", { post }) : res.send("post not able to found ");
    });
});

app.get("/add-post", (req, res) => res.render("add-post"));

app.post("/add-post", (req, res) => {
    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) return res.send("Error not able to load the post");
        const posts = JSON.parse(data);
        posts.push({ id: posts.length + 1, ...req.body });

        fs.writeFile(postsFile, JSON.stringify(posts, null, 2), (err) => {
            if (err) return res.send("Error not able to save post");
            res.redirect("/posts");
        });
    });
});

app.listen(PORT, () => console.log(`Server running at port 3000`));
