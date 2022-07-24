export const slugRegex = /^[-a-zA-Z0-9_]+$/;
export const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/;

export const slugValidator = (value: string) => {
  if (!value) return "Short name field can not be empty!";
  if (!value.match(slugRegex)) return "Please enter a valid name!";
  return "";
};

export const urlValidator = (value: string) => {
  if (!value) return "Link field can not be empty!";
  if (!value.match(urlRegex)) return "Please enter a valid link!";
  return "";
};


