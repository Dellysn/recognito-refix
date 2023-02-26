import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
});

handler.get(async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (session === null) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const completedTask = await prisma.completedTask.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    console.log(completedTask);
    return res.status(200).json({
      message: "Completed Task",
      data: completedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      data: error,
    });
  }
});
export default handler;
