import ApiError from "@/lib-server/error";
import { createNews, getNewsList } from "@/lib-server/services/news";
import { updateIsActive } from "@/lib-server/services/officer";

import { OfficerIsActiveUpdate } from "@/types/models/Officer";
import { NextRequest } from "next/server";

// Generate a POST method handler for create News
const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = (await request.json()) as OfficerIsActiveUpdate;
    const slug = params.id;
    const id = parseInt(slug);

    // data = await validateNewsSave(data);
    const news = await updateIsActive(id, data.is_active);

    return Response.json(news);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { POST };
