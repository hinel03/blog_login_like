const PostsController = require("./posts.controller");
jest.mock("../models");
const { Post } = require("../models");

const postsController = new PostsController();
const req = {
    params: {},
    body: {},
};
const res = {
    locals: { user: { nickname: "test" } },
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(),
  };

  describe("GET /posts", () => {
    test("GET 작성된 글들을 json 형식으로 보낸다", async () => {
      postsController.PostsService.PostRepository.findAllPost =
        jest.fn(() => [{}]);
      await postsController.getPosts(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({
        comment: [
          {
            postId: undefined,
            nickname: undefined,
            title: undefined,
            content: undefined,
            likes: undefined,
            createdAt: undefined,
            updatedAt: undefined,
          },
        ],
      });
    });
  });


