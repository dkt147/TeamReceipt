import commentRepository from "../repositories/commentRepository.js";
class CommentService {
  commentRepository;
  constructor() {
    this.commentRepository = new commentRepository();
  }
  async CreateComment(data) {
    try {
      if (
        data.message === undefined ||
        data.userId === undefined ||
        data.postId === undefined
      ) {
        const error = new Error("Invalid data", 404);
        throw error;
      }
      const response = this.commentRepository.CreatePost(data);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default CommentService;
