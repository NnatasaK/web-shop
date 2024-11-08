import pkg from "validator";
const { escape } = pkg;

export const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return escape(input);
  }

  return input;
};

export const sanitizeStrict = (input) => {
  if (typeof input === "string") {
    return input.replace(/[^a-zA-Z0-9]/g, "");
  }
  return input;
};
