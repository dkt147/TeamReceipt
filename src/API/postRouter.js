import express from "express";
import PostService from "../Services/PostService.js";
import authenticateToken from "../middleware/authnticateToken.js";
import { upload } from "../middleware/upload.js";
import AWS from "aws-sdk";

const postRouter = express();

const service = new PostService();

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "your-aws-region", 
});

postRouter.post(
  "/createPost",
  // authenticateToken,
  upload.array("images", 5),
  async (req, res, next) => {
    try {
      const { phone_number, city, caption, name } = req.body;
      // const images = req.files.map((file) => file.path);

      const images = req.files.map((file) => ({
        path: file.path,
        originalname: file.originalname,
        mimetype: file.mimetype,
      }));

      // Generate pre-signed URL for each image
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const params = {
            Bucket: "your-bucket-name", 
            Key: `uploads/${image.originalname}`, 
            ContentType: image.mimetype,
            ACL: "public-read",
          };

          // Get pre-signed URL for S3 upload
          const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

          // Store the S3 URL and any metadata in your database
          return {
            originalname: image.originalname,
            uploadUrl,
          };
        })
      );


      const data = {
        phone_number,
        city,
        caption,
        // userId: req.user.id,
        userId: "52caa152-a583-4754-ae21-1cde220cd82a",
        name,
        // images: images,
        images: uploadedImages.map((image) => image.uploadUrl),
      };


      console.log(data);
      const response = await service.CreatePost(data);
      console.log(response);
      return res.json(response);
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .json({ status: "fail", message: err.message });
    }
  }
);


postRouter.delete(
  "/deletePost/:id",
  authenticateToken,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const response = await service.DeletePost(id);
      console.log(response);
      return res.json(response);
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .json({ status: "fail", message: err.message });
    }
  }
);

postRouter.get("/getAllPosts", authenticateToken, async (req, res, next) => {
  try {
    const response = await service.GetAllPosts();
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

postRouter.get("/updatePostLike", authenticateToken, async (req, res, next) => {
  try {
    const id = req.body.id;
    const response = await service.UpdatePostLike(id);
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

postRouter.get(
  "/getAllPosts/:id",
  authenticateToken,
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const response = await service.getPostByCurrentUser(id);
      return res.json(response);
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .json({ status: "fail", message: err.message });
    }
  }
);

export default postRouter;
