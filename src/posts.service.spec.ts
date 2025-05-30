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
    // Test the create method thoroughly
    const createdPost = postsService.create(post);

    // Verify the post is created with correct structure
    expect(createdPost).toBeDefined();
    expect(createdPost.text).toBe('Mocked post');
    expect(createdPost.id).toBe('2');
    expect(createdPost.date).toBeDefined();
    expect(typeof createdPost.date).toBe('string');

    // Verify the date is a valid ISO string
    expect(() => new Date(createdPost.date)).not.toThrow();
    expect(new Date(createdPost.date).toISOString()).toBe(createdPost.date);

    // Verify the post is actually added to the posts array by finding it
    const foundPost = postsService.find(createdPost.id);
    expect(foundPost).toEqual(createdPost);

    // Test creating another post to verify ID incrementation
    const secondPost = postsService.create({ text: 'Second post' });
    expect(secondPost.id).toBe('3');
    expect(secondPost.text).toBe('Second post');
    expect(secondPost.date).toBeDefined();
  });

  it('should find a post', () => {
    // Test finding the pre-existing post created in beforeEach
    const foundPreExistingPost = postsService.find('1');
    expect(foundPreExistingPost).toBeDefined();
    expect(foundPreExistingPost?.id).toBe('1');
    expect(foundPreExistingPost?.text).toBe('Some pre-existing post');
    expect(foundPreExistingPost?.date).toBeDefined();

    // Create a new post and test finding it
    const createdPost = postsService.create(post);
    const foundCreatedPost = postsService.find(createdPost.id);

    // Verify find returns the exact post object that was created
    expect(foundCreatedPost).toBeDefined();
    expect(foundCreatedPost).toEqual(createdPost);
    expect(foundCreatedPost?.id).toBe(createdPost.id);
    expect(foundCreatedPost?.text).toBe('Mocked post');
    expect(foundCreatedPost?.date).toBe(createdPost.date);

    // Test finding non-existent post
    const notFoundPost = postsService.find('999');
    expect(notFoundPost).toBeUndefined();

    // Test finding with different ID formats
    const notFoundPost2 = postsService.find('');
    expect(notFoundPost2).toBeUndefined();
  });
});
