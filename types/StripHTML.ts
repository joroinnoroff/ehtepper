export const stripHTML = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const firstParagraph = div.querySelector("p");
  return firstParagraph ? firstParagraph.textContent || firstParagraph.innerText || "" : "";
}