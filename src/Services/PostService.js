import postRepository from "../repositories/postRepository.js";
class PostService {
  constructor() {
    this.postRepository = new postRepository();
  }
  async CreatePost(data) {
    try {
      if (
        data.phone === "" ||
        data.city === "" ||
        data.captions === "" ||
        data.name === ""
      ) {
        const error = errorHandler("Invalid email or password", 404);
        throw error;
      }

      const response = this.postRepository.CreatePost(data);
      return response;
    } catch (error) {
      return error;
    }
  }
  async DeletePost(id) {
    try {
      if (id < 0) {
        const error = errorHandler("Invalid ID", 404);
        throw error;
      }
      const response = await this.postRepository.DeletePost(id);
      console.log(`response: ${response}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async UpdatePostLike(id) {
    try {
      if (id < 0) {
        const error = errorHandler("Invalid ID", 404);
        throw error;
      }
      const response = await this.postRepository.UpdateLike(id);
      console.log(`response: ${response.json()}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async GetAllPosts() {
    try {
      const response = await this.postRepository.GetAllPosts();
      return response;
    } catch (error) {
      return error;
    }
  }
  async getPostByCurrentUser(id) {
    try {
      const response = await this.postRepository.GetPostsByUser(id);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default PostService;
