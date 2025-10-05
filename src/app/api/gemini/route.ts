import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { prompt, cropType, cropData, environmentalData } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize the model
    const model= await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText =  await model?.text;;

    // Try to extract and parse JSON from model response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJSON = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsedJSON);
      }
    } catch (parseError) {
      console.error("❌ Error parsing Gemini response JSON:", parseError);
    }

    // Fallback structured response
    return NextResponse.json({
      summary: responseText.substring(0, 500) + "...",
      recommendations: [
        "Monitor crop health regularly",
        "Adjust irrigation based on soil moisture",
        "Apply fertilizers as per growth stage",
      ],
      risks: ["Weather fluctuations may affect growth"],
      predictedYield: cropData?.area ? cropData.area * 0.8 : null,
      growthTimeline: [],
      keyMetrics: {
        avgGrowthRate: 0.7,
        healthScore: 75,
        waterEfficiency: 0.8,
        fertilizerEfficiency: 0.75,
      },
    });
  } catch (error: any) {
    console.error("❌ Gemini analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze crop growth",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
