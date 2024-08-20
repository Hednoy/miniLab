import { NextRequest } from "next/server";
import {
  deleteMachine,
  getMachine,
  updateMachine,
} from "@/lib-server/services/machine";
import { MachineUpdateData } from "@/types/models/Machine";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const machine = getMachine(id);

    return Response.json(machine);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("PUT", slug);

    const id = parseInt(slug);

    const data = (await request.json()) as MachineUpdateData;

    const machine = await updateMachine(id, data);

    return Response.json(machine);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("DELETE", slug);

    const id = parseInt(slug);

    const machine = await deleteMachine(id);

    return Response.json(machine);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export default {
  GET,
  PUT,
  DELETE,
};
