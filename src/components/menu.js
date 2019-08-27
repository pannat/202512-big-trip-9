import {createElement} from "./utils";

export default class {
  constructor(items) {
    this._items = items;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._items.map((item) => `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : `` }" href="#">${item.title}</a>`).join(``)}
   </nav>`.trim();
  }
}
