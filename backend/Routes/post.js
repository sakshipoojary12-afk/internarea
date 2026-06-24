const express = require("express");
const router = express.Router();
const Post = require("../Model/Post");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= CREATE POST ================= */

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const friendCount = Number(req.body.friendCount || 0);

    let dailyLimit = 0;

    if (friendCount === 0) {
      dailyLimit = 0;
    } else if (friendCount === 1) {
      dailyLimit = 1;
    } else if (friendCount === 2) {
      dailyLimit = 2;
    } else if (friendCount > 10) {
      dailyLimit = Infinity;
    } else {
      dailyLimit = friendCount;
    }

    if (dailyLimit === 0) {
      return res.status(403).json({
        message: "You need friends before posting.",
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const postsToday = await Post.countDocuments({
      userName: req.body.userName,
      createdAt: {
        $gte: startOfDay,
      },
    });

    if (dailyLimit !== Infinity && postsToday >= dailyLimit) {
      return res.status(403).json({
        message: "Daily posting limit reached",
      });
    }

    const post = new Post({
      userName: req.body.userName,
      content: req.body.content,

      media: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "",

      likes: 0,
      shares: 0,
      comments: [],
    });

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= GET POSTS ================= */

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= LIKE ================= */

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.likes += 1;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ================= SHARE ================= */

router.put("/:id/share", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.shares += 1;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ================= COMMENT ================= */

router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      userName: req.body.userName,
      text: req.body.text,
    });

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
router.delete("/:id", async (req, res) => {

try{

const post = await Post.findById(req.params.id);

if(!post){
return res.status(404).json({
message:"Post not found"
});
}

await Post.findByIdAndDelete(req.params.id);

res.json({
message:"Post deleted successfully"
});

}

catch(err){

res.status(500).json({
error:err.message
});

}

});
module.exports = router;