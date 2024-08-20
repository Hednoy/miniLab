// import { handleApiError } from "@/lib-server/error";
// import { apiHandler } from "@/lib-server/nc";
// import {
//   createAgents,
//   getAll,
//   getById,
//   update,
// } from "@/lib-server/services/agents";
// import {
//   agentRegisterSchema,
//   agentUpdateSchema,
// } from "@/lib-server/validation";
// import { ClientAgent } from "@/types/models/Agent";
// import { SortDirection } from "@tanstack/react-table";
// import { NextApiRequest, NextApiResponse } from "next";
// import { withValidation } from "next-validations";
// const handler = apiHandler();

// const defaultPage = 1;
// const defaultPageSize = 5;

// const validateAgentRegister = withValidation({
//   schema: agentRegisterSchema.innerType().omit({
//     confirmPassword: true,
//   }),
//   type: "Zod",
//   mode: "body",
// });

// const validateAgentUpdate = withValidation({
//   schema: agentUpdateSchema,
//   type: "Zod",
//   mode: "body",
// });

// /**
//  * POST /api/users - register
//  * Required fields in body: name, username, email, password
//  */
// handler.post(
//   // validateAgentRegister(),
//   async (req: NextApiRequest, res: NextApiResponse<ClientAgent>) => {
//     try {
//       const agent = await createAgents(req.body);
//       res.status(201).json(agent);
//     } catch (e) {
//       handleApiError(e, req, res);
//     }
//   }
// );

// handler.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   const { query } = req;
//   try {
//     if (typeof query.id === "string") {
//       const agentById = await getById(query.id);
//       res.status(200).json(agentById);
//     } else {
//       const page = parseInt(query.page as string, 10) || defaultPage;
//       const limit = parseInt(query.limit as string, 10) || defaultPageSize;
//       const searchTerm = query.searchTerm as string;
//       const sortDirection = query.sortDirection as string as SortDirection;
//       const agents = await getAll({
//         page,
//         limit,
//         searchTerm,
//         sortDirection,
//       });
//       res.status(200).json(agents);
//     }
//   } catch (error) {
//     handleApiError(error, req, res);
//   }
// });

// handler.patch(
//   validateAgentUpdate(),
//   async (req: NextApiRequest, res: NextApiResponse<any>) => {
//     try {
//       const agent = await update(req.body);
//       res.status(200).json(agent);
//     } catch (e) {
//       handleApiError(e, req, res);
//     }
//   }
// );

// handler.delete(async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   const { query } = req;
//   try {
//     const agentById = await delete query.id;
//     res.status(200).json(agentById);
//   } catch (e) {
//     handleApiError(e, req, res);
//   }
// });

// export default handler; //
