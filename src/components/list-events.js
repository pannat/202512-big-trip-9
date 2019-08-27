import {createElement} from "./utils";

export default class {
  constructor(dates) {
    this._unicueDates = dates;
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
    return `<ul class="trip-days">
            ${this._unicueDates.map((date, count) => `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${count + 1}</span>
                 <time class="day__date" datetime="${new Date(date).toISOString().slice(0, 10)}">${date.slice(3, 10)}</time>
              </div>
              <ul class="trip-events__list">
              </ul>
            </li>`).join(``)}
        </ul>`;
  }
}

