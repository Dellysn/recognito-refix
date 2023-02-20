import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      console.log(req.body);
      const { collectionName, tasks } = req.body;

      try {
        const newCollection = await prisma.taskCollection.create({
          data: {
            name: collectionName,
            tasks: {
              create: tasks,
            },
          },
        });

        return res.status(200).json({
          newCollection,
        });
        // Handle POST request
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          error: "Something went wrong",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method as string} Not Allowed`);
  }
};

export default handler;
