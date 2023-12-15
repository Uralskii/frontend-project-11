export default (content) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(content, 'text/html');

  return html;
};
