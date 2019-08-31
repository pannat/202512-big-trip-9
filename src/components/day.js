import AbstractComponent from "./abstract-component";

export default class extends AbstractComponent {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count + 1;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._count ? this._count : ``}</span>
                 <time class="day__date" datetime="${this._date ? new Date(this._date).toISOString().slice(0, 10) : ``}">${this._date ? this._date.slice(3, 10) : ``}</time>
              </div>
              <ul class="trip-events__list">
              </ul>
            </li>
        </ul>`;
  }
}
