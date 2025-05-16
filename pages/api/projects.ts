import type { WordpressPost } from '../../types/WordpressTypes';

export default async function handler(
  req: any,
  res: {
    status: (arg0: number) => { json: (arg0: WordpressPost[] | { message: string }) => void };
  }
) {
  const url = process.env.WORDPRESS_URL;

  const id = req.query.id;

  try {
    const response = await fetch(`${url}posts?_embed`); // Fetch all posts with _embed
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();

    // Fetch tags and categories for the posts
    const fetchTagsAndCategories = async (tags: number[], categories: number[]) => {
      const fetchedTags = await Promise.all(
        tags.map(async (tagId: number) => {
          const tagResponse = await fetch(`${url}tags/${tagId}`);
          if (tagResponse.ok) {
            return await tagResponse.json();
          }
          return null;
        })
      );

      const fetchedCategories = await Promise.all(
        categories.map(async (categoryId: number) => {
          const categoryResponse = await fetch(`${url}categories/${categoryId}`);
          if (categoryResponse.ok) {
            return await categoryResponse.json();
          }
          return null;
        })
      );

      return {
        tags: fetchedTags.filter(Boolean),
        categories: fetchedCategories.filter(Boolean),
      };
    };

    const enhancedPosts = await Promise.all(
      posts.map(async (post: any) => {
        const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null; // Extract image URL
        const excerptText = post.excerpt?.rendered
          ? post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")
          : ""; // Fallback to an empty string if excerpt is missing


        const { tags, categories } = await fetchTagsAndCategories(post.tags || [], post.categories || []);

        return {
          ...post,
          imageUrl,
          excerptText,
          tags,
          categories,
        };
      })
    );

    res.status(200).json(enhancedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}
