export const getLatestValue = (indicatorData) => {
  if (!indicatorData) return null;
  if (Array.isArray(indicatorData)) {
    return indicatorData[indicatorData.length - 1] || null;
  }
  return indicatorData;
};

export const getPrevValue = (indicatorData) => {
  if (!indicatorData) return null;
  if (Array.isArray(indicatorData)) {
    return indicatorData[indicatorData.length - 2] || null;
  }
  return indicatorData;
}
