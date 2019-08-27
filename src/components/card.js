import {createElement} from "./utils";

export const prepositionMap = {
  transfer: `to`,
  activity: `in`,
  start: `From`,
  end: `To`
};

export default class {
  constructor({type, city, dueDate, time, price, options}) {
    this._type = type;
    this._keyType = Object.keys(type)[0];
    this._city = city;
    this._dueDate = new Date(dueDate);
    this._time = time;
    this._duration = this.calculateDuration(this._dueDate, this._time);
    this._price = price;
    this._options = options;
    this._element = null;
  }

  calculateDuration(dueDate, time) {
    const start = new Date(`${dueDate.toDateString()} ${time.start}`);
    const end = new Date(`${dueDate.toDateString()} ${time.end}`);
    return (end - start) / 1000 / 60;
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
    return `<li class="trip-events__item">
            <div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type[this._keyType].toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${this._type[this._keyType]} ${prepositionMap[this._keyType]} ${this._city}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  ${Object.keys(this._time).map((stage) => `<time class="event__${stage}-time"
                    datetime="${this._dueDate.toISOString().slice(0, 11)}${this._time[stage]}">${this._time[stage]}</time>`).join(` &mdash; `)}
                </p>
                <p class="event__duration">${this._duration}M</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${this._price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                  ${this._options.filter((option) => option.isApplied).map((option) => `<li class="event__offer">
                    <span class="event__offer-title">${option.title}</span>
                    +
                    &euro;
                    <span class="event__offer-price">${option.price}</span>
                </li>`).join(``)}
              </ul>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
  }
}
