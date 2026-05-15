import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(body.prompt);

    const response = result.response.text();

    return Response.json({
      success: true,
      reply: response,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      reply: "AI request failed",
    });
  }
}