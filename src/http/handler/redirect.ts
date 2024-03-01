import { Request, Response } from "express";
import { Entry } from "../../db/schema/Entry";

export const redirect = async (req: Request, res: Response) => {
  const { key } = req.params;

  const entry = await Entry.findOneAndUpdate(
    { key },
    {
      $inc: { accessCount: 1 },
      $push: {
        clicks: {
          date: new Date(),
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      },
    }
  )
    .select("url")
    .lean();

  if (!entry) {
    return res.sendStatus(404);
  }

  return res.redirect(entry.url);
};
