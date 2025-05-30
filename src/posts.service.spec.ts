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
    // Test that create method actually returns a post with all required properties
    const createdPost = postsService.create(post);

    // These assertions will fail if create() returns undefined or empty object
    expect(createdPost).toBeDefined();
    expect(createdPost.text).toBe('Mocked post');
    expect(createdPost.id).toBeDefined();
    expect(createdPost.id).toBe('2');
    expect(createdPost.date).toBeDefined();
    expect(typeof createdPost.date).toBe('string');

    // Verify that the post is actually added to the internal array
    // This will fail if create() doesn't push to this.posts
    const foundPost = postsService.find('2');
    expect(foundPost).toBeDefined();
    expect(foundPost).toBe(createdPost); // Same reference

    // Test that lastPostId is incremented
    const secondPost = postsService.create({ text: 'Another post' });
    expect(secondPost.id).toBe('3');
  });

  it('should find a post', () => {
    // Create a specific post to find
    const createdPost = postsService.create(post);

    // Test that find returns the exact post we're looking for
    const foundPost = postsService.find(createdPost.id);
    expect(foundPost).toBeDefined();
    expect(foundPost).toBe(createdPost); // Same reference
    expect(foundPost?.id).toBe(createdPost.id);
    expect(foundPost?.text).toBe('Mocked post');

    // Test that find returns undefined for non-existent posts
    // This will fail if find() always returns true or the first post
    expect(postsService.find('999')).toBeUndefined();
    expect(postsService.find('0')).toBeUndefined();

    // Test that find returns the correct post when multiple posts exist
    // This will fail if the equality operator is changed to inequality
    const anotherPost = postsService.create({ text: 'Different post' });
    expect(postsService.find(anotherPost.id)).toBe(anotherPost);
    expect(postsService.find(createdPost.id)).toBe(createdPost);

    // Verify we can find the pre-existing post
    const preExistingPost = postsService.find('1');
    expect(preExistingPost).toBeDefined();
    expect(preExistingPost?.text).toBe('Some pre-existing post');
    expect(preExistingPost?.id).toBe('1');
  });
});
