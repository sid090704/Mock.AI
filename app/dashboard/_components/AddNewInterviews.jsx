"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/gemini";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterviews() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [jobRole, setJobRole] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [jobRequirement, setJobRequirement] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `You are an expert technical interviewer who creates realistic, mixed-difficulty interview questions.
Generate a total of ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and detailed answers based on:
Job Role: ${jobRole}
Company: ${company}
Tech Stack: ${jobRequirement}
Experience: ${experience} years
Ensure questions are relevant and realistic. Return only valid raw JSON array in the format:
[{"question": "...", "answer": "..."}]
make sure that plain text is returned without any code blocks or additional formatting. Also make sure that the answer is not given 
in markdown format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const text = result.response.text();
      const jsonMockResp = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\u0000-\u001F]+/g, "")
        .trim();

      const resp = await db
        .insert(MockInterview)
        .values({
          jsonMockResp: jsonMockResp,
          jobRole,
          jobRequirement,
          experience,
          mockId: uuidv4(),
          company,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp?.[0]?.mockId) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      }
    } catch (err) {
      console.error("Error generating interview:", err);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Add New Card */}
     <div
      className="group relative flex flex-col items-center justify-center rounded-2xl p-10 cursor-pointer
        bg-transparent backdrop-blur-sm border border-cyan-400/20
        hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]
        transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02]"
      onClick={() => setOpenDialog(true)}
    >
      {/*  Background Glow Layer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"></div>

      {/*  Icon */}
      <PlusCircle className="w-12 h-12 text-cyan-400 mb-3 drop-shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-transform duration-500 group-hover:rotate-90" />

      {/*  Title */}
      <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
        Add New Interview
      </h2>

      {/*  Subtitle */}
      <p className="text-gray-300 text-sm mt-1">
        Create a new mock interview setup
      </p>
    </div>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-blue-800">
              Create New Interview
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to generate AI-based interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Job Role / Position
              </label>
              <Input
                type="text"
                placeholder="e.g. Frontend Developer"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Deloitte"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Job Requirements / Tech Stack
              </label>
              <Textarea
                placeholder="e.g. React, Node.js, MongoDB"
                required
                value={jobRequirement}
                onChange={(e) => setJobRequirement(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <Input
                type="number"
                placeholder="e.g. 2"
                required
                max="30"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin h-4 w-4" /> Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterviews;
