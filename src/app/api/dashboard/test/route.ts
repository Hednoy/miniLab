import ApiError from "@/lib-server/error";
import { getLabTestListForReport } from "@/lib-server/services/dashboard";
import { PDFlab1 } from "@/lib-server/services/pdf";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabTestForReport, LabTestsGetData } from "@/types/models/LabTest";
import { da } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake.js";
import { writeFileSync } from "fs";

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    // Convert array to CSV format
    const buffer = await PDFlab1(11);

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
