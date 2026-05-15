const pdf = require("pdf-parse/lib/pdf-parse");

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({
        success: false,
        text: "",
        error: "No file uploaded",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await pdf(buffer);

    return Response.json({
      success: true,
      text: result.text || "",
    });
  } catch (error) {
    console.error("Resume scan error:", error);

    return Response.json({
      success: false,
      text: "",
      error: String(error),
    });
  }
}