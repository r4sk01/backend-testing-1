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
    // Test creating a new post
    const createdPost = postsService.create(post);

    // Verify the post has all required properties
    expect(createdPost).toBeDefined();
    expect(createdPost.text).toBe(post.text);
    expect(createdPost.id).toBeDefined();
    expect(createdPost.date).toBeDefined();

    // Verify ID is a string and increments properly
    expect(typeof createdPost.id).toBe('string');
    expect(createdPost.id).toBe('2');

    // Verify date is a valid ISO string
    expect(createdPost.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(new Date(createdPost.date)).toBeInstanceOf(Date);

    // Verify the post can be found after creation
    const foundPost = postsService.find(createdPost.id);
    expect(foundPost).toEqual(createdPost);
  });

  it('should find a post', () => {
    // Create a post to search for
    const createdPost = postsService.create(post);

    // Test finding the created post
    const foundPost = postsService.find(createdPost.id);

    expect(foundPost).toBeDefined();
    expect(foundPost).toEqual(createdPost);
    expect(foundPost?.id).toBe(createdPost.id);
    expect(foundPost?.text).toBe(post.text);
    expect(foundPost?.date).toBe(createdPost.date);
  });

  it('should return undefined when post is not found', () => {
    // Test searching for non-existent post
    const foundPost = postsService.find('999');

    expect(foundPost).toBeUndefined();
  });

  it('should find pre-existing post', () => {
    // Test finding the post created in beforeEach
    const foundPost = postsService.find('1');

    expect(foundPost).toBeDefined();
    expect(foundPost?.id).toBe('1');
    expect(foundPost?.text).toBe('Some pre-existing post');
    expect(foundPost?.date).toBeDefined();
  });

  it('should increment post IDs correctly', () => {
    // Create multiple posts and verify ID incrementation
    const post1 = postsService.create({ text: 'Post 1' });
    const post2 = postsService.create({ text: 'Post 2' });
    const post3 = postsService.create({ text: 'Post 3' });

    expect(post1.id).toBe('2');
    expect(post2.id).toBe('3');
    expect(post3.id).toBe('4');

    // Verify all posts can be found
    expect(postsService.find(post1.id)).toEqual(post1);
    expect(postsService.find(post2.id)).toEqual(post2);
    expect(postsService.find(post3.id)).toEqual(post3);
  });

  it('should handle empty text', () => {
    // Test creating post with empty text
    const emptyPost = postsService.create({ text: '' });

    expect(emptyPost).toBeDefined();
    expect(emptyPost.text).toBe('');
    expect(emptyPost.id).toBeDefined();
    expect(emptyPost.date).toBeDefined();

    // Verify it can be found
    const foundPost = postsService.find(emptyPost.id);
    expect(foundPost).toEqual(emptyPost);
  });
});
