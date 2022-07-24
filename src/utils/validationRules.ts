export const shortName = (value: string) => {
  if (!value) return "Short name field can not be empty";
  if (!value.match("^[-a-zA-Z0-9_]+$")) return "Please enter valid name";
  return "";
};

export const urlPath = (value: string) => {
  if (!value) return "Link field can not be empty";
  if (
    !value.match(
      "[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)"
    )
  )
    return "";
  return "";
};
