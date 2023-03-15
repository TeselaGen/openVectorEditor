export default class CopyOptions {
  features = true;
  partialFeatures = true;
  parts = true;
  partialParts = true;
  toggleCopyOption(type) {
    this[type] = !this[type];
    //handle special cases
    if (type === "partialFeatures" && !this[type]) {
      this.features = true;
    }
    if (type === "partialParts" && !this[type]) {
      this.parts = true;
    }
    if (type === "features") type.partialFeatures = this[type];
    if (type === "parts") type.partialParts = this[type];
  }
}

export const defaultCopyOptions = {
  features: true,
  partialFeatures: true,
  parts: true,
  partialParts: true
};
