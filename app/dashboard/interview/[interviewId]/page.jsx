"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    getInterviewData();
  }, []);

  const getInterviewData = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

  const handleEnableWebcam = () => {
    setShowWebcam(true);
    setPermissionGranted(false); // reset permission flag
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center mt-20 px-4 md:px-10 text-white">
      <h2 className="mt-20 text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
        Let’s Get Started
      </h2>
      <p className="text-gray-300 mt-2 text-sm md:text-base text-center">
        Review your interview details before starting your mock session.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 w-full max-w-6xl">
        {/* 🧠 Interview Details Card */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-all duration-500">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Interview Details
          </h3>

          <div className="space-y-4 relative z-10">
            <p className="text-lg">
              <strong className="text-cyan-300">Job Role:</strong>{" "}
              {interviewData?.jobRole || "Loading..."}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-300">Company:</strong>{" "}
              {interviewData?.company || "Loading..."}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-300">Requirements:</strong>{" "}
              {interviewData?.jobRequirement || "Loading..."}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-300">Experience:</strong>{" "}
              {interviewData?.experience || "Loading..."}
            </p>

            <div className="mt-10 p-5 border border-yellow-300/40 bg-yellow-100/10 rounded-xl text-yellow-200">
              <h4 className="flex gap-2 items-center mb-2 text-yellow-300">
                <Lightbulb className="h-5 w-5" /> <strong>Information</strong>
              </h4>
              <p className="text-sm leading-relaxed text-yellow-100/80">
                {process.env.NEXT_PUBLIC_INFO ||
                  "Make sure your camera and microphone are working properly before starting."}
              </p>
            </div>
          </div>
        </div>

        {/* 🎥 Webcam Section */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-all duration-500">
          {!showWebcam ? (
            <>
              <WebcamIcon className="h-40 w-40 text-gray-400 my-8 p-4 rounded-xl border border-dashed border-gray-500/30 bg-white/5" />
              <Button
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
                onClick={handleEnableWebcam}
              >
                Enable Webcam & Microphone
              </Button>
            </>
          ) : (
            <>
              <Webcam
                onUserMedia={() => setPermissionGranted(true)}
                onUserMediaError={() => setPermissionGranted(false)}
                mirrored={true}
                style={{
                  height: "300px",
                  width: "100%",
                  borderRadius: "12px",
                  border: "2px solid rgba(34,211,238,0.5)",
                  backgroundColor: "rgba(15,23,42,0.4)",
                }}
              />
              <p className="mt-3 text-sm text-gray-400">
                {permissionGranted
                  ? "✅ Camera access granted"
                  : "Waiting for permission..."}
              </p>
            </>
          )}

          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button
              className={`mt-6 w-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold py-3 rounded-xl shadow-lg transition-all ${
                permissionGranted
                  ? "hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                  : "opacity-60 cursor-not-allowed"
              }`}
              disabled={!permissionGranted}
            >
              {permissionGranted ? (
                <>
                  <Camera className="w-5 h-5 mr-2" /> Start Interview
                </>
              ) : (
                "Enable Webcam First"
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interview;
