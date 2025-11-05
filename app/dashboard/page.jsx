"use client";
import React from "react";
import AddNewInterviews from "./_components/AddNewInterviews";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    <div className="relative z-10 p-8 md:p-10 mt-20 text-white">
      {/* 🧠 Header Section */}
      <div className="text-center md:text-left mt-10">
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Dashboard
        </h2>
        <p className="text-gray-300 mt-2 text-lg">
          Manage your mock interviews, track performance, and level up your prep.
        </p>
      </div>

      {/* 🪄 Add New Interview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
        <div className="col-span-1 md:col-span-3">
          <div className="relative group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            <AddNewInterviews />
            
          </div>
        </div>
      </div>

      {/* ⚡ Previous Interviews */}
      <section className="mt-12">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Previous Interviews
        </h3>

        <div>
          <InterviewList />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
