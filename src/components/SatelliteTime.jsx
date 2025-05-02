import React from "react";
import { parseTimestamp } from "../utils/dateUtils";

const SatelliteTime = ({ timestamp }) => {
  return <span className="font-mono text-sm">{parseTimestamp(timestamp)}</span>;
};

export default SatelliteTime;
