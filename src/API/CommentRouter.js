import express from "express";
import CommentService from "../Services/CommentService.js";
import authenticateToken from "../middleware/authnticateToken.js";
const commentRouter = express();

const commentService = new CommentService();
commentRouter.post("/create", authenticateToken, async (req, res) => {
  try {
    const { message, postId, parentId } = req.body;
    const data = {
      message: message,
      postId: postId,
      parentId: parentId,
      userId: req.user.id,
    };
    console.log(data);
    const response = await commentService.CreateComment(data);
    console.log(response);
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

export default commentRouter;
