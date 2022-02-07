import type { NextApiRequest, NextApiResponse } from "next";
const pgp = require("pg-promise")({
  noWarnings: true,
});

const POSTGRES_PASS = process.env.POSTGRES_PASSWORD;
const db = pgp(
  `postgresql://postgres:${POSTGRES_PASS}@db.bzxetxyfhjyqpmzroook.supabase.co:5432/postgres`
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
