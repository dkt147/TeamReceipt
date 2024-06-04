import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { deleteImages } from "../middleware/upload.js";
class postRepository {
  async CreatePost(data) {
    try {
      const createdPost = await prisma.posts.create({
        data: {
          phone_number: data.phone_number,
          city: data.city,
          caption: data.caption,
          name: data.name,
          userId: data.userId,
        },
      });
      if (data.images && data.images.length > 0) {
        for (const imagePath of data.images) {
          await prisma.image.create({
            data: {
              path: imagePath,
              postId: createdPost.id,
            },
          });
        }
      }
      return {
        success: true,
        message: "Post created successfully",
        statusCode: 201,
      };
    } catch (err) {
      return err;
    }
  }
  async DeletePost(id) {
    try {
      const post = await prisma.posts.findUnique({
        where: {
          id: id,
        },
        include: {
          image: true, // Include the related images for the post
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      deleteImages(post.image);
      await prisma.image.deleteMany({
        where: {
          postId: id,
        },
      });
      await prisma.posts.delete({
        where: {
          id: id,
        },
      });
      return {
        success: true,
        message: "Post deleted successfully",
        statusCode: 201,
      };
    } catch (err) {
      return err;
    }
  }

  async UpdateLike(id) {
    try {
      const post = await prisma.posts.findFirst({
        where: {
          id: id,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      await prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          likes: post.likes + 1,
        },
      });
      return {
        success: true,
        message: "Post like updated successfully",
        statusCode: 201,
      };
    } catch (err) {
      return err;
    }
  }
  async GetAllPosts() {
    const response = await prisma.posts.findMany({
      include: {
        image: true,
        comments: true,
      },
    });
    return response;
  }

  async GetPostsByUser(id) {
    const response = await prisma.posts.findMany({
      where: {
        userId: id,
      },
      include: {
        image: true,
      },
    });
    return response;
  }
}

export default postRepository;
