import React, { useState, useCallback, useEffect } from "react";
import SatelliteTime from "./SatelliteTime";
import Timeline from "./Timeline";
import VideoTimeline from "./VideoTimeline";

const WeatherViewer = () => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [useVideoMode, setUseVideoMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-04-03");

  // Handle keyboard shortcuts for fullscreen and navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      } else if (e.key === "ArrowRight") {
        handleSelectTime((prev) => Math.min(prev + 1, 8));
      } else if (e.key === "ArrowLeft") {
        handleSelectTime((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Image preloading for smoother transitions
  useEffect(() => {
    const weatherData = buildWeatherData(selectedDate);
    weatherData.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [selectedDate]);

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateComponents = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return { year, month, day };
  };

  const buildWeatherData = (dateString) => {
    const { year, month, day } = getDateComponents(dateString);
    const baseTimestamp = `${year}${month}${day}T210000Z`;
    const pathPrefix = `/images/${year}${month}${day}`;

    const formattedDateShort = new Date(dateString).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );

    return {
      baseTimestamp,
      timeIntervals: [
        { label: "21:00", type: "actual", date: formattedDateShort },
        { label: "21:15", type: "actual", date: formattedDateShort },
        { label: "21:30", type: "actual", date: formattedDateShort },
        { label: "21:45", type: "actual", date: formattedDateShort },
        { label: "22:00", type: "actual", date: formattedDateShort },
        { label: "22:15", type: "forecast", date: formattedDateShort },
        { label: "22:30", type: "forecast", date: formattedDateShort },
        { label: "22:45", type: "forecast", date: formattedDateShort },
        { label: "23:00", type: "forecast", date: formattedDateShort },
        { label: "23:15", type: "forecast", date: formattedDateShort },
        { label: "23:30", type: "forecast", date: formattedDateShort },
        { label: "23:45", type: "forecast", date: formattedDateShort },
        { label: "00:00", type: "forecast", date: formattedDateShort },
      ],
      images: [
        `${pathPrefix}/actual_2100.jpg`,
        `${pathPrefix}/actual_2115.jpg`,
        `${pathPrefix}/actual_2130.jpg`,
        `${pathPrefix}/actual_2145.jpg`,
        `${pathPrefix}/actual_2200.jpg`,
        `${pathPrefix}/forecast_2215.jpg`,
        `${pathPrefix}/forecast_2230.jpg`,
        `${pathPrefix}/forecast_2245.jpg`,
        `${pathPrefix}/forecast_2300.jpg`,
        `${pathPrefix}/forecast_2315.jpg`,
        `${pathPrefix}/forecast_2330.jpg`,
        `${pathPrefix}/forecast_2345.jpg`,
        `${pathPrefix}/forecast_2400.jpg`,
      ],
    };
  };

  const weatherData = buildWeatherData(selectedDate);

  const handleSelectTime = (index) => {
    // Process index change directly without transitions
    if (typeof index === "function") {
      setSelectedTimeIndex((prevIndex) => index(prevIndex));
    } else {
      setSelectedTimeIndex(index);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeIndex(0);
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const currentTimeData = weatherData.timeIntervals[selectedTimeIndex];
  const isActual = currentTimeData.type === "actual";

  return (
    <div
      className={`flex flex-col transition-all duration-300 ease-in-out ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-gray-900"
          : "min-h-screen bg-gray-100"
      } p-6`}
    >
      {/* Header section */}
      <header
        className={`mb-6 rounded-xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 shadow-2xl h-16"
            : "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg"
        }`}
      >
        <div className={`p-6 ${isFullscreen ? "lg:pr-96" : ""}`}>
          <h1
            className={`text-3xl font-bold text-center text-white transition-all duration-300 ${
              isFullscreen ? "text-4xl font-bold text-gray-800 pl-56" : ""
            }`}
          >
            India Weather Nowcast Viewer
          </h1>
          <p
            className={`text-center mt-2 font-light transition-all duration-300 ${
              isFullscreen ? "text-blue-200 text-lg" : "text-blue-100"
            }`}
          >
            {formatDisplayDate(selectedDate)} • Satellite data from{" "}
            <SatelliteTime timestamp={weatherData.baseTimestamp} />
          </p>

          {/* Mode toggles and Date selector - only for non-fullscreen mode */}
          {!isFullscreen && (
            <>
              <div className="flex justify-center mt-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 flex shadow-md mb-2">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !useVideoMode
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setUseVideoMode(false)}
                  >
                    Standard View
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      useVideoMode
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setUseVideoMode(true)}
                  >
                    Video Mode
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex items-center">
                  <label
                    htmlFor="date-select"
                    className="text-sm font-medium text-gray-700 mr-3"
                  >
                    Select Date:
                  </label>
                  <input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border rounded px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    min="2025-01-01"
                    max="2025-12-31"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col lg:flex-row gap-6 mb-6 transition-all duration-300 ${
          isFullscreen ? "items-center" : ""
        }`}
      >
        {/* Main Visualization */}
        <div
          className={`transition-all duration-300 ${
            isFullscreen
              ? "w-full max-w-7xl pr--50" // Shifted to the left by adding right padding
              : "bg-white rounded-lg shadow-lg p-5 flex-1 lg:w-2/3"
          }`}
        >
          <div
            className={`flex justify-between items-center mb-4 ${
              isFullscreen ? "text-white" : ""
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                isFullscreen ? "text-white" : "text-gray-800"
              }`}
            >
              {currentTimeData.label} •{" "}
              {isActual ? "Actual Observation" : "Forecast Prediction"}
            </h2>
            <span
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                isActual
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200"
              }`}
            >
              {isActual ? "Actual" : "Nowcast"}
            </span>
          </div>

          <div
            className={`relative transition-all duration-300 ${
              isFullscreen ? "h-[70vh]" : "aspect-video"
            } bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 shadow-inner`}
          >
            {/* Simple image display without transition effects */}
            <img
              src={weatherData.images[selectedTimeIndex]}
              alt={`Precipitation at ${currentTimeData.label}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Overlay with additional info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Convective Rain Rate (CRR)
                  </p>
                  <p className="text-xs text-gray-300">
                    Measurement unit: mm/h
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-32 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full"></div>
                  <div className="text-xs">0-50+ mm/h</div>
                </div>
              </div>
            </div>

            {/* Time indicator */}
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentTimeData.date} • {currentTimeData.label}
            </div>

            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-3 right-3 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title={
                isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"
              }
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8V3h5M21 8V3h-5M3 16v5h5m13-5v5h-5"></path>
                </svg>
              )}
            </button>

            {/* Navigation controls */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <button
                onClick={() =>
                  handleSelectTime((prev) => Math.max(prev - 1, 0))
                }
                disabled={selectedTimeIndex === 0}
                className={`p-2 rounded-full bg-black bg-opacity-70 ${
                  selectedTimeIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-opacity-90 hover:scale-110"
                } transition-all`}
                title="Previous frame (←)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() =>
                  handleSelectTime((prev) => Math.min(prev + 1, 8))
                }
                disabled={selectedTimeIndex === 8}
                className={`p-2 rounded-full bg-black bg-opacity-70 ${
                  selectedTimeIndex === 8
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-opacity-90 hover:scale-110"
                } transition-all`}
                title="Next frame (→)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {!isFullscreen && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                <div>
                  <h3 className="font-medium text-gray-700 text-sm mb-2">
                    Color Scale (mm/h)
                  </h3>
                  <div className="h-4 w-48 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-md shadow-inner"></div>
                  <div className="flex justify-between text-xs mt-1 text-gray-600">
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                  </div>
                </div>
                <div className="flex-1 border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6">
                  <h3 className="font-medium text-gray-700 text-sm mb-2">
                    About This Data
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Convective Rain Rate (CRR) data from METEOSAT satellite over
                    India. The forecast uses advanced optical flow techniques
                    with PySTEPS to predict precipitation movement and
                    intensity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline panel */}
        {!isFullscreen && (
          <div className="lg:w-1/3">
            {useVideoMode ? (
              <VideoTimeline
                times={weatherData.timeIntervals}
                selectedIndex={selectedTimeIndex}
                onSelectTime={handleSelectTime}
                autoPlaySpeed={750}
              />
            ) : (
              <Timeline
                times={weatherData.timeIntervals}
                selectedIndex={selectedTimeIndex}
                onSelectTime={handleSelectTime}
              />
            )}
          </div>
        )}
      </div>

      {/* Fullscreen controls panel */}
      {isFullscreen && (
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          {/* Left side - Date selector & Mode toggle */}
          <div className="flex items-center gap-4">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-700">
              <div className="flex items-center">
                <label
                  htmlFor="date-select-fs"
                  className="text-sm font-medium text-white mr-3"
                >
                  Date:
                </label>
                <input
                  id="date-select-fs"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border rounded px-3 py-2 text-sm w-44 bg-black/30 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  min="2025-01-01"
                  max="2025-12-31"
                />
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex shadow-lg border border-gray-700">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !useVideoMode
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
                onClick={() => setUseVideoMode(false)}
              >
                Standard
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  useVideoMode
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
                onClick={() => setUseVideoMode(true)}
              >
                Video
              </button>
            </div>
          </div>

          {/* Right side - Exit button */}
          <button
            onClick={toggleFullscreen}
            className="bg-black/40 backdrop-blur-md hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all border border-gray-700 hover:scale-105 flex items-center gap-2"
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
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
            Exit Fullscreen
          </button>
        </div>
      )}

      {/* Fullscreen timeline - moved to start below header with height adjusted */}
      {isFullscreen && (
        <div className="absolute right-0 top-24 bottom-0 w-80 bg-black/40 backdrop-blur-md shadow-xl border-l border-gray-700 transition-all duration-300 overflow-y-auto">
          <div className="p-4">
            {useVideoMode ? (
              <VideoTimeline
                times={weatherData.timeIntervals}
                selectedIndex={selectedTimeIndex}
                onSelectTime={handleSelectTime}
                autoPlaySpeed={750}
              />
            ) : (
              <Timeline
                times={weatherData.timeIntervals}
                selectedIndex={selectedTimeIndex}
                onSelectTime={handleSelectTime}
              />
            )}
          </div>
        </div>
      )}

      {/* Fullscreen keyboard shortcut hint */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-4 text-white/70 text-xs bg-black/30 px-3 py-1 rounded-full">
          Keyboard shortcuts: ← → to navigate frames, ESC or F to toggle
          fullscreen
        </div>
      )}

      {/* Footer */}
      {!isFullscreen && (
        <footer className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-lg text-white">
            <p className="font-medium">
              Precipitation nowcasting system using PySTEPS and METEOSAT
              satellite data
            </p>
            <p className="text-sm mt-1 text-blue-100">
              © 2025 Weather Forecasting Division | All rights reserved
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default WeatherViewer;
