import FilterProjects from '@/components/FilterProjects';

import ArtGallery from '@/components/ArtGallery';
import { WordpressPost } from '@/types/WordpressTypes';

import React, { useEffect, useState } from 'react';


interface Props { }

const page = () => {
  const [posts, setPosts] = useState<WordpressPost[]>([]);

  const [filteredPosts, setFilteredPosts] = useState<WordpressPost[]>([]);


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const posts: WordpressPost[] = await response.json();
      setPosts(posts);
      setFilteredPosts(posts);








    };

    fetchPosts();
  }, []);








  return (
    <main className='min-h-screen p-3 xl:px-10'>
      <div className='mt-10 '>
        <h1 className="px-3 lg:px-5 2xl:px-10 text-6xl lg:text-9xl 2xl:text-[8.1vw] tracking-wide  pt-5 ">All Projects </h1>
      </div>

      <FilterProjects posts={posts} setFilteredPosts={setFilteredPosts} />
      <span className='font-mono text-right '>({filteredPosts.length})</span>
      <ArtGallery posts={filteredPosts}
        images={filteredPosts.map((post) => post.imageUrl).filter((url): url is string => typeof url === 'string')}
        artTitles={filteredPosts.map((post) => post.title.rendered)} // Use title.rendered
      />





    </main>
  );
};

export default page;