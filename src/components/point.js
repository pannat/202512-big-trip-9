import AbstractComponent from "./abstract-component";
import {prepositionMap, calculateDuration} from "../utils";
import moment from 'moment';

export default class extends AbstractComponent {
  constructor({type, city, date, time, price, options}) {
    super();
    this._type = type;
    this._keyType = Object.keys(type)[0];
    this._city = city;
    this._date = moment(date).format().slice(0, 11);
    this._time = time;
    this._duration = calculateDuration(date, time);
    this._price = price;
    this._options = options;
  }

  getTemplate() {
    return `<div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type[this._keyType].toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${this._type[this._keyType]} ${prepositionMap[this._keyType]} ${this._city}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  ${Object.keys(this._time).map((stage) => `<time class="event__${stage}-time"
                    datetime="${this._date}${this._time[stage]}">${this._time[stage]}</time>`).join(` &mdash; `)}
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
            </div>`;
  }
}
