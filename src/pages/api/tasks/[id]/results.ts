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

handler.post(async (req, res) => {
  try {
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

    console.log(req.body.results);
    const result = await prisma.completedTask.create({
      data: {
        name: task.name,
        task: {
          connect: {
            id: task.id,
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
        results: {
          set: req.body.results,
        },
      },
    });
    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: "completed",
      },
    });

    res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error,
    });
  }
});

handler.get(async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const id = req.query.id;

    if (session === null) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await prisma.completedTask.findUnique({
      where: {
        id: String(id),
      },
    });

    if (result === null) {
      res.status(404).json({ error: "Result not found" });
      return;
    }

    if (result.userId !== session.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error,
    });
  }
});

handler.delete(async (req, res) => {
  console.log(req.url);
  const session = await getServerSession(req, res, authOptions);
  const id = req.query.id;

  if (session === null) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const task = await prisma.completedTask.findUnique({
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

  await prisma.completedTask.delete({
    where: {
      id: task.id,
    },
  });

  res.status(200).json({
    message: "success",
  });
});

export default handler;
