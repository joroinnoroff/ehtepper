import Image from "next/image";


import ArtGallery from "@/components/ArtGallery";

import Hero from "@/components/Hero";


import { WordpressPost, WordpressTag } from "@/types/WordpressTypes";
import { useState, useEffect } from "react";

import { VideoBanner } from "@/components/VideoBanner";

import Link from "next/link";


import { Product } from "@/types/WooCommerceTypes";
import BuyArt from "@/components/BuyArtGallery";
import HpSlider from "@/components/HpSlider";
import Lenis from "@studio-freight/lenis";
import Intro from "@/components/Intro";




export default function Home() {
  const [posts, setPosts] = useState<WordpressPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<WordpressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const posts: WordpressPost[] = await response.json();
        setPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-products');
        const data = await response.json();

        console.log("Fetched products:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected an array but got: " + JSON.stringify(data));
        }

        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);


  return (
    <main className="w-full h-full">


      <div className="h-full w-full">
        <Intro />
        <Hero />
      </div>










    </main>
  );
}
