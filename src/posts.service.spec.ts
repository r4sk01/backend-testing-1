import { Post, PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  const post: Omit<Post, 'id' | 'date'> = {
    text: 'Mocked post',
  };

  beforeEach(async () => {
    postsService = new PostsService();

    postsService.create({ text: 'Some pre-existing post' });
  });

  it('should add a new post', () => {
    // Create New Post
    const createdPost = postsService.create(post);

    // Check Post Fields
    expect(createdPost).toBeDefined();
    expect(createdPost.id).toBeDefined();
    expect(createdPost.id).toBe('2');
    expect(createdPost.text).toBe(post.text);
    expect(createdPost.date).toBeDefined();

    // Date has Valid Format
    expect(() => new Date(createdPost.date)).not.toThrow();

    const foundPost = postsService.find(createdPost.id);
    expect(foundPost).toBeDefined();
    expect(foundPost).toEqual(createdPost);
  });

  it('should find a post', () => {
    // Create New Post
    const createdPost = postsService.create(post);

    // Find Post by ID
    const foundPost = postsService.find(createdPost.id);

    // Check that found === created
    expect(foundPost).toBeDefined();

    if (foundPost) {
      expect(foundPost).toEqual(createdPost);
      expect(foundPost.id).toBe(createdPost.id);
      expect(foundPost.text).toBe(createdPost.text);
      expect(foundPost.date).toBe(createdPost.date);
    }

    // Check that Search With Bad ID returns Undefined
    const nonExistentPost = postsService.find('999');
    expect(nonExistentPost).toBeUndefined();
  });
});
