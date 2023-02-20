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
  const session = await getServerSession(req, res, authOptions);
  const id = req.query.id;
  console.log(id);
  if (session === null) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const task = await prisma.task.findUnique({
    where: {
      id: String(id),
    },
    include: {
      user: true,
    },
  });

  if (task === null) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  if (task.userId !== session.user.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(200).json(task);
});

export default handler;
