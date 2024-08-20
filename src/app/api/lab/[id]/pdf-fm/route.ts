import { PDFlab2 } from "@/lib-server/services/pdf";
import { NextRequest } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    // Convert array to CSV format
    const buffer = await PDFlab2(id);

    return new Response(buffer, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=testtest.pdf",
      },
    });
    // return Response.json({ message: "Hello" });
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
