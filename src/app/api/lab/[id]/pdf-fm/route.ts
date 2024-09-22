import { PDFlab2 } from "@/lib-server/services/pdf";
import { NextRequest } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    const id = parseInt(slug);

    // Extract case_no from query parameters
    const { searchParams } = new URL(request.url);
    const case_no = searchParams.get("case_no") || undefined;

    console.log("GET", { id, case_no });

    const buffer = await PDFlab2(id, case_no); // Assuming PDFlab2 accepts case_no

    return new Response(buffer, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${case_no || "default"}.pdf`, // Display in browser with filename
      },
    });
  } catch (e: any) {
    return new Response(e.message || "Error occurred", {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
