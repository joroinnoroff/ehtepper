import { retrieveProductById } from "@/utils/woomerceApi";

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  try {
    const { id } = req.query;
    const products = await retrieveProductById(id);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
