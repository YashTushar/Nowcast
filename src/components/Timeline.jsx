import React from "react";

const Timeline = ({ times, selectedIndex, onSelectTime }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full relative z-0">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h2>

      <div className="flex flex-col h-full">
        {/* Timeline items */}
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

        {/* Current selection info */}
        <div className="mt-4 p-2 bg-gray-50 rounded-md border border-gray-200 text-sm">
          <span className="text-gray-700">
            Selected: {times[selectedIndex].date} at{" "}
            {times[selectedIndex].label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                times[selectedIndex].type === "actual"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {times[selectedIndex].type === "actual" ? "Actual" : "Forecast"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
