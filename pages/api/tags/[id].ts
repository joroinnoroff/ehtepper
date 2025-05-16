import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  res.status(200).json({ id });
};

export default handler;
