export function validateId(id) {
  let parsedId;
  if (!(/^[0-9]+$/gi.test(id))) return false;
  try {
    parsedId = parseInt(id);
  } catch (e) {
    return false;
  }
  if (isNaN(parsedId)) return false;
  if (!Number.isInteger(parsedId)) return false;
  if (id < 1) return false;
  return true;
}