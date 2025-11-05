"use client";
import React from "react";
import Header from "../../components/Header";
import PixelBlast from "@/components/PixelBlast";

function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌈 ReactBits PixelBlast Background */}
      <div className="absolute inset-0 z-10">
        <PixelBlast
          variant="circle"            // Try square, triangle, diamond
          pixelSize={5}
          color="#8b5cf6"             // purple-cyan glow
          patternScale={3}
          patternDensity={1.55}
          liquid={true}
          liquidStrength={0.05}
          rippleIntensityScale={1.2}
          rippleSpeed={0.25}
          liquidRadius={1.2}
          transparent={true}
          edgeFade={0.3}
          className="w-full h-full bg-black"
        />
      </div>

      {/* 🧭 Persistent Navbar/Header */}
      <Header />

      {/* 📦 Main content area */}
      <main className="relative z-10 mx-5 md:mx-20 lg:mx-36 mt-20">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
