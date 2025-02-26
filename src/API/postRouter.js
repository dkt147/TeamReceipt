import express from "express";
import PostService from "../Services/PostService.js";
import authenticateToken from "../middleware/authnticateToken.js";
import { upload } from "../middleware/upload.js";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import fs from 'fs';
import util from 'util';

const postRouter = express();

const service = new PostService();

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1", 
});

const readFile = util.promisify(fs.readFile);

postRouter.post(
  '/createPost',
  // authenticateToken,
  upload.array('images', 5),
  async (req, res, next) => {
    try {
      const { phone_number, city, caption, name } = req.body;
      const images = req.files.map((file) => ({
        path: file.path,
        originalname: file.originalname,
        mimetype: file.mimetype,
      }));

      // Generate pre-signed URL for each image and upload using AWS SDK
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const fileData = await readFile(image.path);

          const params = {
            Bucket: 'tea-receipts-s3',
            Key: `uploads/posts/${image.originalname}`,
            Body: fileData,
            ContentType: image.mimetype,
          };

          try {
            // Upload the image to S3 using the AWS SDK
            await s3.putObject(params).promise();

            // Generate a pre-signed URL for the uploaded image
            const signedUrlParams = {
              Bucket: 'tea-receipts-s3',
              Key: `uploads/posts/${image.originalname}`,
              Expires: 60 * 60, // 1 hour
            };

            // Log parameters for debugging
            console.log('Signed URL Params:', signedUrlParams);

            const signedUrl = s3.getSignedUrl('getObject', signedUrlParams);

            // Log the generated URL for debugging
            console.log('Generated Signed URL:', signedUrl);

            if (!signedUrl) {
              throw new Error(`Failed to generate signed URL for ${image.originalname}`);
            }

            // Return the S3 URL and any metadata
            return {
              originalname: image.originalname,
              s3Url: signedUrl,
            };
          } catch (uploadError) {
            console.error(`Error uploading image ${image.originalname}:`, uploadError);
            throw new Error(`Failed to upload image ${image.originalname}`);
          }
        })
      );

      console.log('uploadedImages',uploadedImages);

      const data = {
        phone_number,
        city,
        caption,
        // userId: req.user.id,
        userId: '104d6e47-4d4c-42a6-a71b-817ee204991e',
        name,
        images: uploadedImages.map((img) => img.s3Url),
      };

      console.log(data);
      const response = await service.CreatePost(data);
      console.log(response);
      return res.json(response);
    } catch (err) {
      console.error('Error during post creation:', err);
      res.status(err.statusCode || 500).json({ status: 'fail', message: err.message });
    }
  }
);

// Endpoint to refresh signed URL
postRouter.get('/refreshUrl', async (req, res) => {
  const { key } = req.query;

  const params = {
    Bucket: 'tea-receipts-s3',
    Key: key,
    Expires: 60 * 60, // 1 hour
  };

  // Log parameters for debugging
  console.log('Refresh URL Params:', params);

  try {
    const signedUrl = s3.getSignedUrl('getObject', params);

    // Log the generated URL for debugging
    console.log('Generated Signed URL:', signedUrl);

    if (!signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    res.json({ signedUrl });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    res.status(500).json({ status: 'fail', message: 'Error generating signed URL' });
  }
});

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
