import type { NextApiRequest, NextApiResponse } from "next";
const pgp = require("pg-promise")({
  noWarnings: true,
});

const db = pgp(`postgres://babak:123456@localhost:5432/label`);

export default async function getLabels(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = "SELECT address, label from labels WHERE address= ANY($1)";

  const label = await db.query(query, [req.body.req]);

  console.log(label);

  res.status(200).json(label);
}
