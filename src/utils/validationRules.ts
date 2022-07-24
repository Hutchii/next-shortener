export const nameRegex = /^[-a-zA-Z0-9]+$/;
export const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/;

export const shortName = (value: string) => {
  if (!value) return "Short name field can not be empty!";
  if (!value.match(/^[-a-zA-Z0-9_]+$/)) return "Please enter a valid name!";
  return "";
};

export const urlPath = (value: string) => {
  if (!value) return "Link field can not be empty!";
  if (!value.match(urlRegex)) return "Please enter a valid link!";
  return "";
};
