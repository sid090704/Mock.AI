"use client";
import { useRouter } from "next/navigation";
import CardNav from "./CardNav";
import React, { useEffect, useState } from "react";

function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      label: "HomePage",
      bgColor: "#BFBDBD",
      textColor: "#fff",
      links: [{ label: "Home", href: "/", ariaLabel: "Go to Home" }],
    },
    {
      label: "Go to Dashboard",
      bgColor: "#A6A6A6",
      textColor: "#fff",
      links: [
        {
          label: "Dashboard",
          href: "/dashboard",
          ariaLabel: "Mock Interview",
        },
      ],
    },
    {
      label: "Analyse Your Resume",
      bgColor: "#969696",
      textColor: "#fff",
      links: [
        {
          label: "Resume Analysis",
          href: "/resume",
          ariaLabel: "Go to Resume Analysis",
        },
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
      ${
        scrolled
          ? "bg-black backdrop-blur-md shadow-lg border-b border-black"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="flex items-center justify-center px-6 md:px-12 h-[80px]">
        <CardNav
          logo="/images/logo.png"
          logoAlt="Mock.AI"
          items={navItems}
          baseColor="#E0E0DA"
          menuColor="#858282"
          buttonBgColor="#22d3ee"
          buttonTextColor="#000"
          className="mt-2 bg-transparent"
        />
      </div>
    </header>
  );
}

export default Header;
