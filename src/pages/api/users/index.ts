import { handleApiError } from "@/lib-server/error";
import { apiHandler } from "@/lib-server/nc";
import {
  createUser,
  getAll,
  getById,
  update,
} from "@/lib-server/services/users";
import { userRegisterSchema, userUpdateSchema } from "@/lib-server/validation";
import { ClientUser } from "@/types/models/User";
import { SortDirection } from "@tanstack/react-table";
import { NextApiRequest, NextApiResponse } from "next";
import { withValidation } from "next-validations";
const handler = apiHandler();

const defaultPage = 1;
const defaultPageSize = 5;

const validateUserRegister = withValidation({
  schema: userRegisterSchema.innerType().omit({
    confirmPassword: true,
  }),
  type: "Zod",
  mode: "body",
});

const validateUserUpdate = withValidation({
  schema: userUpdateSchema,
  type: "Zod",
  mode: "body",
});

/**
 * POST /api/users - register
 * Required fields in body: name, username, email, password
 */
handler.post(
  validateUserRegister(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    try {
      const agent = await createUser(req.body);
      res.status(201).json(agent);
    } catch (e) {
      handleApiError(e, req, res);
    }
  }
);

handler.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { query } = req;
  try {
    if (typeof query.id === "string") {
      const userById = await getById(parseInt(query.id));
      res.status(200).json(userById);
    } else {
      const page = parseInt(query.page as string, 10) || defaultPage;
      const limit = parseInt(query.limit as string, 10) || defaultPageSize;
      const searchTerm = query.searchTerm as string;
      const sortDirection = query.sortDirection as string as SortDirection;
      const users = await getAll({
        page,
        limit,
        searchTerm,
        sortDirection,
      });
      res.status(200).json(users);
    }
  } catch (error) {
    handleApiError(error, req, res);
  }
});

handler.patch(
  validateUserUpdate(),
  async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
      const agent = await update(req.body);
      res.status(200).json(agent);
    } catch (e) {
      handleApiError(e, req, res);
    }
  }
);

handler.delete(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { query } = req;
  try {
    const agentById = await delete query.id;
    res.status(200).json(agentById);
  } catch (e) {
    handleApiError(e, req, res);
  }
});

export default handler;
