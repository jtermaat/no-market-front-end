
const standardDeviation = (data) => {
    let powerSum1 = 0.0;
    let powerSum2 = 0.0;
    let currentValue = 0.0;
    let count = 0;

    for (let i = 0;i<data.length;i++) {
        const value = data[i];
        powerSum1 += value;
        powerSum2 += Math.pow(value, 2);
        count ++;
    }
    const discriminant = count * powerSum2 - Math.pow(powerSum1, 2);
    if (discriminant < 0) {
        return -1 * Math.sqrt(-1 * discriminant) / count;
    } else {
        return Math.sqrt(discriminant) / count;
    }
};

export default standardDeviation;