import React, { useState, useEffect } from "react";

const VideoTimeline = ({
  times,
  selectedIndex,
  onSelectTime,
  autoPlaySpeed = 1000,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onSelectTime((prev) => (prev === times.length - 1 ? 0 : prev + 1));
    }, autoPlaySpeed);

    return () => clearInterval(interval);
  }, [isPlaying, times.length, onSelectTime, autoPlaySpeed]);

  // Stop playing when we reach the end
  useEffect(() => {
    if (selectedIndex === times.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [selectedIndex, times.length, isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (selectedIndex < times.length - 1) {
      onSelectTime(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      onSelectTime(selectedIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full relative z-0">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Video Timeline
      </h2>

      <div className="flex flex-col h-full">
        {/* Timeline items - same as regular timeline but with player controls */}
        <div className="flex-1 flex flex-col justify-between border-l-2 border-gray-200 ml-4 relative">
          {times.map((time, index) => {
            const isActual = time.type === "actual";
            const isSelected = index === selectedIndex;

            return (
              <button
                key={index}
                onClick={() => onSelectTime(index)}
                className={`flex items-center mb-4 -ml-[9px] transition-all ${
                  isSelected ? "scale-105" : ""
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    isSelected
                      ? "bg-blue-500 border-blue-600"
                      : isActual
                      ? "bg-green-100 border-green-300"
                      : "bg-orange-100 border-orange-300"
                  }`}
                />

                {/* Time label */}
                <div className="ml-3 flex flex-col items-start">
                  <div className="flex items-center">
                    <span
                      className={`font-medium ${
                        isSelected ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {time.label}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {time.date}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 mt-1 rounded-full ${
                      isActual
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {isActual ? "Actual" : "Forecast"}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Vertical line extension for aesthetic purposes */}
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-200"></div>
        </div>

        {/* Video controls */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handlePlayToggle}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedIndex === times.length - 1}
              className="p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${(selectedIndex / (times.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="mt-2 text-xs text-center text-gray-600">
            Frame {selectedIndex + 1} of {times.length} -{" "}
            {times[selectedIndex].type === "actual" ? "Actual" : "Forecast"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTimeline;
