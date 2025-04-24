// CellRenderer.js
export function renderCell(key, value, defaultValue) {
  const val = value !== undefined ? value : defaultValue;

  if (key === "age") {
    if (val < 18) return "Minor";
    else if (val >= 25 && val < 59) return "Major";
    else return "Senior";
  }

  if (key === "score") return parseFloat(val).toFixed(2);

  return val;
}
