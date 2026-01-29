// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import companyLogo from "../assets/infinity.png";

const Navbar = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent layout jump */}
      {isFixed && <div className="h-[64px]" />}

      <header
        className={`
          py-3 px-3
          ${isFixed ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md" : "relative"}
          animate-fade-in transition-all duration-300
        `}
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <img
            src={companyLogo}
            alt="Inicio Insights"
            className="w-12 h-10 object-contain
                       group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-semibold text-blue-500">
            <span className="text-[#00afef]">Inicio</span> Insights
          </span>
        </div>
      </header>
    </>
  );
};

export default Navbar;
