//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "The personal blog is an ongoing online diary or commentary written by an individual, rather than a corporation or organization. While the vast majority of personal blogs attract very few readers, other than the blogger's immediate family and friends, a small number of personal blogs have become popular, to the point that they have attracted lucrative advertising sponsorship. A tiny number of personal bloggers have become famous, both in the online community and in the real world.";
const aboutContent =
  "Hi, I am Devanshu, I am a student at Baba Farid College of Engineering and Technology pursuing a Btech degree in Computer Science and I have a YouTube channel named Mr Techpedia. 2 years back, I started Mr Techpedia, with the ambition of sharing my knowledge with the world, and now it's a community with over 20,000+ Tech Enthusiasts who are excited to learn about the latest tech. My goal is simple: Teach the world to form a logical perspective towards technology. I am a MERN-stack developer, a YouTube celebrity, and a coffee lover (no sugar please!). I have a decent ability to learn new programming skills and solve some real-life problems by implementing them. So far I am expertise in Node JS, Express JS, MongoDB, and React JS. Looking forward to learning more about the world of computer science and technology. If given an opportunity I can prove myself with my skills by taking it as a challenge to make me a better programmer.";
const contactContent = "You can contact via our email: mrtechpedia@gmail.com";

const app = express();

mongoose.connect(
  "mongodb+srv://admin-devanshu:Test123@cluster0.sy9pc.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, foundPosts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne(
    {
      _id: requestedPostId,
    },
    function (err, foundPost) {
      if (!err) {
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content,
        });
      }
    }
  );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
