"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, CalendarDays, MessageSquare, PlayCircle } from "lucide-react";

function InterviewItemCard({ interviewItem }) {
  const router = useRouter();

  const onFeedback = () => {
    router.push(`/dashboard/interview/${interviewItem?.mockId}/feedback`);
  };

  const onStart = () => {
    router.push(`/dashboard/interview/${interviewItem?.mockId}/start`);
  };

  const experienceValue = Number(interviewItem?.experience);
  const experienceText =
    !Number.isFinite(experienceValue) || experienceValue === 0
      ? "Fresher"
      : experienceValue === 1
      ? "1 Year"
      : `${experienceValue} Years`;

  // parse dd-mm-yyyy safely
  let formattedDate = "N/A";
  if (interviewItem?.createdAt) {
    const [d, m, y] = interviewItem.createdAt.split("-");
    if (d && m && y) {
      const parsed = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      formattedDate = parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer 
      bg-white/10 backdrop-blur-xl border border-cyan-400/10 shadow-[0_0_10px_rgba(56,189,248,0.1)]
      hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] 
      transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* 🔮 Glow overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"></div>

      {/* 🧠 Card content */}
      <div className="relative z-10 space-y-3">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
          {interviewItem?.jobRole || "Untitled Role"}
        </h2>

        <p className="flex items-center text-gray-300 text-sm">
          <Building2 size={16} className="mr-2 text-cyan-400" />
          Company:
          <span className="text-white font-semibold ml-1">
            {interviewItem?.company || "Not specified"}
          </span>
        </p>

        <p className="flex items-center text-gray-300 text-sm">
          <Briefcase size={16} className="mr-2 text-purple-400" />
          Required Experience:
          <span className="text-white font-medium ml-1">{experienceText}</span>
        </p>

        <p className="flex items-center text-gray-300 text-sm">
          <CalendarDays size={16} className="mr-2 text-blue-400" />
          Created On:
          <span className="text-white font-medium ml-1">{formattedDate}</span>
        </p>
      </div>

      {/* 🚀 Buttons */}
      <div className="relative z-10 flex gap-3 mt-6">
        {/* 🌈 Feedback button */}
        <Button
          onClick={onFeedback}
          size="sm"
          variant="outline"
          className="flex-1 sm:flex-none border-cyan-400/40 text-cyan-600 relative overflow-hidden
          hover:text-black hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></span>
          <span className="relative flex items-center gap-2 z-10">
            <MessageSquare
              size={16}
              className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            />
            Feedback
          </span>
        </Button>

        {/* 🚀 Start button */}
        <Button
          onClick={onStart}
          size="sm"
          className="flex-1 sm:flex-none relative font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 overflow-hidden
          hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-300"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 blur-xl transition-opacity duration-500"></span>
          <span className="relative flex items-center gap-2 z-10">
            <PlayCircle
              size={18}
              className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            />
            Start
          </span>
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
