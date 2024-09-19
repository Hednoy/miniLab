import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime-types";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const filePath = "/public/file/" + params.id;
    // Construct the file path and verify if the image exists on the server
    const imagePath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(imagePath)) {
      return new Response("Image file not found", {
        status: 404,
        statusText: "Not Found",
      });
    }

    // Use mime-types to determine the correct Content-Type
    const contentType = mime.contentType(path.extname(imagePath)) || "application/octet-stream";

    // Read the image file into a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Return the image buffer in the response
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      },
    });
  } catch (e: any) {
    return new Response(e.message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export { GET };