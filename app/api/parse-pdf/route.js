import { NextResponse } from "next/server";
import "pdf-parse/worker"; // Required for the library to function in Node
import { PDFParse, VerbosityLevel } from "pdf-parse";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "PDF file not found" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // Parse PDF using the official class-based approach
    const parser = new PDFParse({
      data: arrayBuffer,
      verbosity: VerbosityLevel.WARNINGS
    });
    
    const data = await parser.getText();
    await parser.destroy();

    return NextResponse.json({
      text: data.text,
      numPages: data.total
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the PDF" },
      { status: 500 }
    );
  }
}