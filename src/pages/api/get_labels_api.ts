import type { NextApiRequest, NextApiResponse } from "next";
const pgp = require("pg-promise")({
  noWarnings: true,
});

const db = pgp(
  `postgresql://postgres:${process.env.LABELS_POSTGRES_PASSWORD}@${process.env.LABELS_POSTGRES_ENDPOINT}`
);

export default async function getLabels(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query =
    "SELECT address ,tag, entity from labels WHERE address= ANY($1)";

  const label = await db.query(query, [req.body.req]);

  res.status(200).json(label);
}
