// src/components/ProgressBar.tsx
import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
}) => {
  const percentage = Math.round(((current + 1) / total) * 100);
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
      {isFixed && <div className="h-[140px]" />}

      <div
        className={`
          ${isFixed ? "fixed top-15 left-0 right-0 z-50 bg-white shadow-md" : ""}
          transition-all duration-300
        `}
      >
        <div className="px-4 pt-4">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-bold sm:text-2xl -mt-2">
              Evaluation of Women Empowerment Initiatives at Reliance Foundation:
              Women leaders India Fellowship
            </h2>
          </div>

          <div className="mb-4">
            {/* Label */}
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>

            {/* Track */}
            <div
              className="
                h-3 rounded-full bg-gray-100
                shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]
              "
            >
              {/* Fill */}
              <div
                className="
                  h-full rounded-full
                  bg-linear-to-r from-blue-500 to-indigo-600
                  transition-all duration-500 ease-out
                  shadow-[2px_2px_6px_rgba(0,0,0,0.15)]
                "
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
