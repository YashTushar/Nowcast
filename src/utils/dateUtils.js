export const parseTimestamp = (timestamp) => {
  if (!timestamp) return "";

  try {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(9, 11);
    const minute = timestamp.substring(11, 13);

    return `${day}/${month}/${year} ${hour}:${minute} UTC`;
  } catch (e) {
    return timestamp;
  }
};
