import AbstractComponent from "./abstract-component";

export default class extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._items.map((item) => `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : `` }" href="#">${item.title}</a>`).join(``)}
   </nav>`.trim();
  }
}
