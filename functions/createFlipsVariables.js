export default function createFlipsVariables(flips) {
  let flipsVariables = {};
  const flipsPNL = flips.reduce((total, obj) => {
    const difference = Number(obj.difference);
    if (!isNaN(difference)) {
      return total + difference;
    } else {
      return total;
    }
  }, 0);

  const totalDuration = flips.reduce((total, obj) => {
    // Convert the dateEntered and dateExited strings to Date objects
    const dateEntered = new Date(obj.dateEntered);
    const dateExited = new Date(obj.dateExited);

    if (
      dateEntered.getTime() &&
      dateExited.getTime() &&
      dateEntered < dateExited
    ) {
      // If the dates are valid, calculate the duration in milliseconds and add it to the total
      return total + (dateExited - dateEntered);
    } else {
      // If the dates are invalid, return the current total
      return total;
    }
  }, 0);

  // Calculate the average duration
  const averageDuration = totalDuration / flips.length;
  // Convert the duration to days
  const durationInDays = Math.floor(averageDuration / (1000 * 60 * 60 * 24));
  const numberOfFlips = flips.length;

  const positiveFlips = flips.filter((flip) => {
    return flip.difference > 0;
  }).length;
  const neutralFlips = flips.filter((flip) => {
    return flip.difference == 0;
  }).length;
  const negativeFlips = flips.filter((flip) => {
    return flip.difference < 0;
  }).length;

  const totalChange = flips.reduce((acc, obj) => {
    if (obj.percentage === "Infinity" || obj.percentage === "NaN") {
      return acc;
    }
    return acc + Number(obj.percentage);
  }, 0);

  const averageChange =
    totalChange /
    flips
      .filter((flip) => flip.percentage !== "Infinity")
      .filter((flip) => flip.percentage !== "NaN").length;

  const totalPositiveChange = flips
    .filter((flip) => flip.percentage > 0)
    .reduce((acc, obj) => {
      if (obj.percentage === "Infinity" || obj.percentage === "NaN") {
        return acc;
      }
      return acc + Number(obj.percentage);
    }, 0);

  const averagePositiveChange =
    totalPositiveChange /
    flips
      .filter((flip) => flip.difference > 0)
      .filter((flip) => flip.percentage !== "Infinity")
      .filter((flip) => flip.percentage !== "NaN").length;

  const totalNegativeChange = flips
    .filter((flip) => flip.percentage < 0)
    .reduce((acc, obj) => {
      if (obj.percentage === "Infinity" || obj.percentage === "NaN") {
        return acc;
      }
      return acc + Number(obj.percentage);
    }, 0);

  const averageNegativeChange =
    totalNegativeChange /
    flips
      .filter((flip) => flip.difference < 0)
      .filter((flip) => flip.percentage !== "Infinity")
      .filter((flip) => flip.percentage !== "NaN").length;

  return (flipsVariables = {
    totalPNL: flipsPNL,
    averageDurationInDays: durationInDays,
    allFlips: numberOfFlips,
    positiveFlips: positiveFlips,
    negativeFlips: negativeFlips,
    neutralFlips: neutralFlips,
    averageChange: averageChange,
    averagePositiveChange: averagePositiveChange,
    averageNegativeChange: averageNegativeChange,
  });
}
