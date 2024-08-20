import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.getAll("files")[0] as File;

    if (!file) {
      return new Response("No file was uploaded", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const oldFileName = file.name;
    const newFileName = `${Date.now()}.${fileExtension}`;

    // write the file to the file system
    const path = "./public/file/" + newFileName;
    const pathForDB = "/public/file/" + newFileName;
    writeFile(path, buffer)
      .then((f) => {})
      .catch((e) => {
        throw e;
      });

    console.log("file", file, buffer);

    return Response.json({
      old_file_name: oldFileName,
      new_file_name: newFileName,
      size: file.size,
      path: pathForDB,
    });

    // return NextResponse.json({
    //   old_file_name: oldFileName,
    //   new_file_name: newFileName,
    //   size: file.size,
    //   path: pathForDB,
    // });
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { POST };
