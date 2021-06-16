/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(0, (x * 255), 255)
 *
 * @param {Number} min The lower boundary of the output range.
 * @param {Number} value The value to clamp.
 * @param {Number} max The upper boundary of the output range.
 * @returns A number in the range [min, max].
 */
const clamp = (min: number, value: number, max: number) => Math.min(Math.max(value, min), max);

export { clamp };
