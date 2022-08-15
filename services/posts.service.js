const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    return allPost.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findPostById = async (postId) => {
    const findpost = await this.postRepository.findPostById(postId);

    return {
      postId: findpost.postId,
      nickname: findpost.nickname,
      title: findpost.title,
      content: findpost.content,
      likes: findpost.likes,
      createdAt: findpost.createdAt,
      updatedAt: findpost.updatedAt,
    };
  };

  createPost = async (nickname, title, content, likes) => {
    const createPostData = await this.postRepository.createPost(
      nickname,
      title,
      content,
      likes
    );

    return {
      postId: createPostData.null,
      nickname: createPostData.nickname,
      title: createPostData.title,
      content: createPostData.content,
      likes: createPostData.likes,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    };
  };

  updatePost = async (postId, title, content, password, userPassword) => {
    const findPost = await this.postRepository.findPostById(postId);

    if (!findPost) throw new Error("Post deosn't exist");

    if (password !== userPassword) throw new Error("Password doesn't match");

    const updatePost = await this.postRepository.updatePost(
      postId,
      title,
      content
    );

    return {
      postId: updatePost.postId,
      nickname: updatePost.nickname,
      title: updatePost.title,
      content: updatePost.content,
      likes: updatePost.likes,
      createdAt: updatePost.createdAt,
      updatedAt: updatePost.updatedAt,
    };
  };

  deletePost = async (postId, password, userPassword) => {
    const findPost = await this.postRepository.findPostById(postId);

    if (!findPost) throw new Error("Post doesn't exist");
    if (password !== userPassword) throw new Error("Password doesn't match");

    await this.postRepository.deletePost(postId, password);

    return {
      postId: findPost.postId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      likes: findPost.likes,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };
  };

  likePost = async (postId, userId) => {
    const findPost = await this.postRepository.findPostById(postId);

    if (!findPost) throw new Error("Post doesn't exist");

    const createLikePostData = await this.postRepository.likePost(
      postId,
      userId
    );

    return {
      postId: createLikePostData.postId,
      nickname: createLikePostData.nickname,
      title: createLikePostData.title,
      content: createLikePostData.content,
      likes: createLikePostData.likes,
      createdAt: createLikePostData.createdAt,
      updatedAt: createLikePostData.updatedAt,
    };
  };

  dislikePost = async (postId, userId) => {
    const updateLikePost = await this.postRepository.dislikePost(
      postId,
      userId
    );

    return {
      postId: updateLikePost.postId,
      nickname: updateLikePost.nickname,
      title: updateLikePost.title,
      content: updateLikePost.content,
      likes: updateLikePost.likes,
      createdAt: updateLikePost.createdAt,
      updatedAt: updateLikePost.updatedAt,
    };
  };
}

module.exports = PostService;
