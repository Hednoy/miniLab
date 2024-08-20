// // app/api/person/[id].ts

// import { getPersonById } from "@/lib-server/services/person";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const {
//     query: { id },
//   } = req;

//   const person = await getPersonById(parseInt(id as string));

//   if (person) {
//     res.status(200).json(person);
//   } else {
//     res.status(404).json({ message: `Person with ID ${id} not found` });
//   }
// }
