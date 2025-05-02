import React, { useState, useCallback } from "react";
import SatelliteTime from "./SatelliteTime";
import Timeline from "./Timeline";
import VideoTimeline from "./VideoTimeline";

const WeatherViewer = () => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [useVideoMode, setUseVideoMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-04-03");

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
      ],
    };
  };

  const weatherData = buildWeatherData(selectedDate);

  const handleSelectTime = (index) => {
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
      className={`flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 bg-black" : "min-h-screen bg-gray-50"
      } p-6`}
    >
      {/* Header section */}
      <header
        className={`mb-6 rounded-xl overflow-hidden ${
          isFullscreen
            ? "bg-gradient-to-r from-blue-900 to-indigo-900"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
        }`}
      >
        <div className={`p-6 ${isFullscreen ? "pr-96" : ""}`}>
          <h1 className="text-2xl font-bold text-center text-white">
            India Weather Nowcast Viewer
          </h1>
          <p
            className={`text-center mt-2 ${
              isFullscreen ? "text-blue-200" : "text-blue-100"
            }`}
          >
            {formatDisplayDate(selectedDate)} - Satellite data from{" "}
            <SatelliteTime timestamp={weatherData.baseTimestamp} />
          </p>

          {/* Mode toggles and Date selector */}
          <div
            className={`flex justify-center ${
              isFullscreen
                ? "absolute top-6 left-6 z-50 flex-col items-center"
                : "mt-4"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 flex shadow-sm mb-2">
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  !useVideoMode
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setUseVideoMode(false)}
              >
                Standard View
              </button>
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  useVideoMode
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setUseVideoMode(true)}
              >
                Video Mode
              </button>
            </div>
            {isFullscreen && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-2 flex items-center">
                <label
                  htmlFor="date-select"
                  className="text-sm font-medium text-gray-700 mr-2"
                >
                  Select Date:
                </label>
                <input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={`border rounded px-3 py-1 text-sm w-44 ${
                    isFullscreen
                      ? "bg-black/20 text-white border-gray-400"
                      : "bg-white text-gray-800"
                  }`}
                  min="2025-01-01"
                  max="2025-12-31"
                />
              </div>
            )}
          </div>
          {!isFullscreen && (
            <div className={`flex justify-center mt-4`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-2 flex items-center">
                <label
                  htmlFor="date-select"
                  className="text-sm font-medium text-gray-700 mr-2"
                >
                  Select Date:
                </label>
                <input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={`border rounded px-3 py-1 text-sm w-44 ${
                    isFullscreen
                      ? "bg-black/20 text-white border-gray-400"
                      : "bg-white text-gray-800"
                  }`}
                  min="2025-01-01"
                  max="2025-12-31"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col lg:flex-row gap-6 mb-6 ${
          isFullscreen ? "items-center justify-center" : ""
        }`}
      >
        {/* Main Visualization */}
        <div
          className={`${
            isFullscreen
              ? "w-full max-w-5xl"
              : "bg-white rounded-lg shadow-md p-4 flex-1 lg:w-2/3"
          }`}
        >
          <div
            className={`flex justify-between items-center mb-4 ${
              isFullscreen ? "text-white" : ""
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                isFullscreen ? "text-white" : "text-gray-800"
              }`}
            >
              {currentTimeData.label} -{" "}
              {isActual ? "Actual Observation" : "Forecast Prediction"}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActual
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {isActual ? "Actual" : "Nowcast"}
            </span>
          </div>

          <div
            className={`relative ${
              isFullscreen ? "h-[70vh]" : "aspect-video"
            } bg-gray-200 rounded-md overflow-hidden flex items-center justify-center`}
          >
            <img
              src={weatherData.images[selectedTimeIndex]}
              alt={`Precipitation at ${currentTimeData.label}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm">
              Convective Rain Rate (CRR) - mm/h
            </div>

            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-80 transition-opacity"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
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
          </div>

          {!isFullscreen && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center space-x-6">
                <div>
                  <h3 className="font-medium text-gray-700 text-sm mb-1">
                    Color Scale (mm/h)
                  </h3>
                  <div className="h-3 w-48 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-sm"></div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-700 text-sm mb-1">
                    About This Data
                  </h3>
                  <p className="text-xs text-gray-600">
                    Convective Rain Rate (CRR) data from METEOSAT satellite over
                    India. The forecast uses optical flow techniques with
                    PySTEPS.
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

      {/* Fullscreen timeline */}
      {isFullscreen && (
        <div className="absolute top-36 right-6 w-80 max-h-[calc(100vh-9rem)] overflow-y-auto">
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

      {/* Footer */}
      {!isFullscreen && (
        <footer className="mt-6 text-center text-sm text-gray-500">
          <p>
            Precipitation nowcasting system using PySTEPS and METEOSAT satellite
            data
          </p>
          <p>© 2025 Weather Forecasting Division</p>
        </footer>
      )}
    </div>
  );
};

export default WeatherViewer;
