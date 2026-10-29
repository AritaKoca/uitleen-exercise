// values typed by visitors must be escaped before they go into an HTML string
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default class Item {
  id: number;
  name: string;
  description: string;

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  renderHtmlString(): string {
    const htmlString = `
      <article id="item-${this.id}">
        <h2>${escapeHtml(this.name)}</h2>
        <p>${escapeHtml(this.description ?? "")}</p>
        <button class="archive-button" id="item-archive-${this.id}">Archive</button>
      </article>
    `;

    return htmlString;
  }
}
