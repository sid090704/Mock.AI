"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Orb from "@/components/OrbBackground";

export default function Home() {
  const router = useRouter();

  return (
    
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Orb Background */}
      <div className="absolute inset-0 ">
        <Orb />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-center mb-4">
          <Sparkles size={42} className="text-cyan-400 drop-shadow-glow" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Mock.AI
        </h1>

        <p className="max-w-xl mx-auto text-gray-300 text-lg mb-8">
          Experience AI-powered mock interviews designed to prepare you for your
          dream job — anytime, anywhere.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-cyan-500/30 transition-all duration-300"
            onClick={() => router.replace("/dashboard")}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
