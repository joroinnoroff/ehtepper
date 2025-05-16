import { NextApiRequest, NextApiResponse } from "next";
import { retrieveProductById } from "@/utils/woomerceApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.WORDPRESS_URL;
  const { id } = req.query;

  if (!url) {
    return res.status(500).json({ message: "WORDPRESS_URL environment variable is not set" });
  }

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    if (req.method === "GET") {

      const postResponse = await fetch(`${url}posts/${id}?_embed`);
      console.log("Fetching URL:", `${url}posts/${id}?_embed`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return res.status(postResponse.status).json({ message: "Post not found" });
      }

      const post = await postResponse.json();
      const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      const excerptText = post.excerpt?.rendered
        ? post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")
        : "";

      const enhancedPost = {
        ...post,
        imageUrl,
        excerptText,
      };

      return res.status(200).json(enhancedPost);
    }

    if (req.method === "POST") {

      const products = await retrieveProductById(id as string);
      return res.status(200).json(products);
    }


    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
