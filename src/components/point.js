import AbstractComponent from "./abstract-component";
import {prepositionMap} from "../utils";
import moment from 'moment';

export default class extends AbstractComponent {
  constructor({type, city, dates, price, options, duration}) {
    super();
    this._type = type;
    this._keyType = Object.keys(type)[0];
    this._city = city;
    this._dates = dates;
    this._duration = {
      day: this._setFormatUnitTime(moment.duration(duration).days()),
      hours: this._setFormatUnitTime(moment.duration(duration).hours()),
      minutes: this._setFormatUnitTime(moment.duration(duration).minutes())
    };
    this._price = price;
    this._options = options;
  }

  _setFormatUnitTime(unit) {
    return unit > 9 ? unit : `0${unit}`;
  }

  _formatDuration() {
    return `${+this._duration.day ? `${this._duration.day}D ${this._duration.hours}H` :
      `${+this._duration.hours ? `${this._duration.hours}H` : ``}` } ${this._duration.minutes}M`;
  }

  getTemplate() {
    return `<div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type[this._keyType].toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${this._type[this._keyType]} ${prepositionMap[this._keyType]} ${this._city}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  ${Object.keys(this._dates).map((stage) => `<time class="event__${stage}-time"
                    datetime="${moment(this._dates[stage]).format(`YYYY-MM-DDTHH:mm`)}">${moment(this._dates[stage]).format(`HH:mm`)}</time>`).join(` &mdash; `)}
                </p>
                <p class="event__duration">${this._formatDuration()}</p>
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
            </div>`;
  }
}
