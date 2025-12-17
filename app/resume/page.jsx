"use client";

import React, { useState } from "react";
import { chatSession } from "@/utils/gemini";
import { LoaderCircle, Upload, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";

function ResumeAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file!");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("An error occurred while processing the PDF");
      }

      const pdfData = await response.json();
      const resumeText = pdfData.text;

      const prompt = `
Analyze the following resume text and provide a professional score (0-100) and feedback.

Resume Content:
${resumeText}

Return ONLY a JSON object in this format:
{
  "score": number,
  "summary": "Detailed summary of the resume",
  "strengths": ["list item 1", "list item 2"],
  "improvements": ["list item 1", "list item 2"],
  "ats_compatibility": "High/Medium/Low"
}
      `;

      const result = await chatSession.sendMessage(prompt);
      const rawText = await result.response.text();

      const cleanJson = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\u0000-\u001F]+/g, "")
        .trim();

      setAnalysisResult(JSON.parse(cleanJson));
      toast.success("Analysis complete!");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-black via-slate-900 to-black text-white">

    <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">

      {/* HERO */}
      <div className="text-center space-y-6 mt-20">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse leading-[1.2] pb-1">
          AI Resume Analyzer
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Upload your resume and receive an AI-powered evaluation with ATS compatibility insights.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="relative">
        <div className="border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl p-14 text-center transition hover:border-cyan-400/40 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]">

          <input
            type="file"
            id="resumeInput"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
          />

          <label
            htmlFor="resumeInput"
            className="cursor-pointer flex flex-col items-center gap-5"
          >
            <div className="p-7 rounded-full bg-cyan-500/10 border border-cyan-400/30 transition group-hover:scale-105">
              <Upload className="h-11 w-11 text-cyan-400" />
            </div>

            <p className="text-lg font-semibold">
              {fileName || "Click to upload your resume"}
            </p>

            <p className="text-xs text-gray-500">
              PDF only · AI-based analysis · ATS optimized
            </p>

            {fileName && !loading && (
              <p className="text-green-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                File ready for analysis
              </p>
            )}
          </label>

          {loading && (
            <div className="mt-10 flex flex-col items-center gap-3 animate-pulse">
              <LoaderCircle className="animate-spin text-cyan-400 h-6 w-6" />
              <p className="text-xs text-gray-400">
                Analyzing resume with AI…
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS */}
      {analysisResult && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

          {/* SCORE + ATS */}
          <div className="grid md:grid-cols-2 gap-8">

            <div className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center">
              <p className="uppercase text-xs tracking-widest text-gray-500 mb-3">
                Resume Score
              </p>

              <p
                className={`text-8xl font-black tracking-tight ${
                  analysisResult.score > 80
                    ? "text-green-400"
                    : analysisResult.score > 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {analysisResult.score}
                <span className="text-3xl">%</span>
              </p>

              <p className="mt-3 text-xs text-gray-500">
                Based on general ATS & recruiter benchmarks
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center">
              <p className="uppercase text-xs tracking-widest text-gray-500 mb-3">
                ATS Compatibility
              </p>

              <span
                className={`inline-block mt-6 px-8 py-3 rounded-full text-lg font-bold ${
                  analysisResult.ats_compatibility === "High"
                    ? "bg-green-500/20 text-green-400"
                    : analysisResult.ats_compatibility === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {analysisResult.ats_compatibility}
              </span>

              <p className="mt-4 text-xs text-gray-500">
                Compatibility with common tracking systems
              </p>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-10">
            <h3 className="text-xl font-semibold mb-4">
              Professional Summary
            </h3>
            <p className="text-gray-400 italic leading-relaxed text-sm">
              “{analysisResult.summary}”
            </p>
          </div>

          {/* STRENGTHS & IMPROVEMENTS */}
          <div className="grid md:grid-cols-2 gap-10">

            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <h4 className="flex items-center gap-2 font-semibold text-green-400 mb-5">
                <CheckCircle2 className="h-5 w-5" />
                Strengths
              </h4>

              <ul className="space-y-3 text-sm">
                {analysisResult.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-gray-300">
                    <span className="text-green-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <h4 className="flex items-center gap-2 font-semibold text-yellow-400 mb-5">
                <FileText className="h-5 w-5" />
                Improvements
              </h4>

              <ul className="space-y-3 text-sm">
                {analysisResult.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-2 text-gray-300">
                    <span className="text-yellow-400">•</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  </div>
);

}

export default ResumeAnalysis;
