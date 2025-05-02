import React from "react";

const TimelineItem = ({ time, isSelected, isActual, onClick }) => {
  const baseClasses =
    "flex flex-col items-center cursor-pointer transition-all";
  const selectedClasses = isSelected
    ? "scale-110 font-bold"
    : "opacity-70 hover:opacity-100";

  return (
    <div className={`${baseClasses} ${selectedClasses}`} onClick={onClick}>
      <div
        className={`w-3 h-3 rounded-full mb-1 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        } ${isActual ? "bg-green-500" : "bg-orange-400"}`}
      />
      <div className="text-xs">
        {time}
        <div className="text-[10px] text-gray-500">
          {isActual ? "Actual" : "Forecast"}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
