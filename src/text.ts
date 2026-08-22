// Rough text width estimate: CJK glyphs ~= 1em, latin ~= 0.6em.
export const estimateTextWidth = (text: string, fontSize: number) => {
  let units = 0;
  for (const ch of text) {
    units += /[^\x00-\xff]/.test(ch) ? 1 : 0.6;
  }
  return units * fontSize;
};
