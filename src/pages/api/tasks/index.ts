import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const tasks = await prisma.task.findMany({
          include: {
            user: true,
          },
        });
        return res.status(200).json(tasks);
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          error: "Something went wrong",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method as string} Not Allowed`);
  }
};
export default handler;
