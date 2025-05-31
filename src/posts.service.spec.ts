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

  describe('create()', () => {
    it('should add a new post with generated id and date', () => {
      const created = postsService.create(post);

      expect(created.text).toBe(post.text);

      expect(created.id).toBe('2');

      expect(new Date(created.date).toISOString()).toBe(created.date);

      expect(postsService.find(created.id)).toEqual(created);
    });
  });

  describe('find()', () => {
    it('should find an existing post and return undefined when not found', () => {
      const existing = postsService.find('1');

      expect(existing).toBeDefined();
      expect(existing?.id).toBe('1');
      expect(existing?.text).toBe('Some pre-existing post');
      expect(new Date(existing!.date).toISOString()).toBe(existing!.date);

      expect(postsService.find('non-existing-id')).toBeUndefined();
    });
  });
});
