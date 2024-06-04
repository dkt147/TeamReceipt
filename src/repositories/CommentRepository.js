import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class CommentRepository {
  async CreatePost(data) {
    try {
      if (
        data.message === undefined ||
        data.userId === undefined ||
        data.postId === undefined
      ) {
        console.log(data);
        return { message: "Invalid Data" };
      }

      const commentData = {
        message: data.message,
        user: { connect: { id: data.userId } },
        post: { connect: { id: data.postId } },
      };

      if (data.parentId !== undefined) {
        // If parentId is provided, connect to an existing parent comment
        commentData.parent = { connect: { id: data.parentId } };
      }

      await prisma.comments.create({
        data: commentData,
      });

      return {
        success: true,
        message: "comment created successfully",
        statusCode: 201,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default CommentRepository;
