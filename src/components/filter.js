import {createElement} from "./utils";

export default class {
  constructor(filters) {
    this._items = filters;
    this._element = null;
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
    return `<form class="trip-filters" action="#" method="get">
              ${this._items.map((item) => `<div class="trip-filters__filter">
                <input id="filter-${item.title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.title.toLowerCase()}"
                ${item.isActive ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-${item.title.toLowerCase()}">${item.title}</label>
              </div>`).join(``)}

              <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
  }
}
