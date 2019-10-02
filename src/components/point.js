import {formatDuration} from "../utils";
import moment from 'moment';
import AbstractPoint from "./abstract-point";

class Point extends AbstractPoint {
  constructor({type, city, dates, price, offers, duration}) {
    super({type, city, dates, price});
    this._offers = offers;
    this._duration = formatDuration(duration);
  }

  getTemplate() {
    return `<div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${this._choosenType.toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${this._choosenType} ${this._preposition} ${this._city}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  ${Object.keys(this._dates).map((stage) => `<time class="event__${stage}-time"
                    datetime="${moment(this._dates[stage]).format(`YYYY-MM-DDTHH:mm`)}">${moment(this._dates[stage]).format(`HH:mm`)}</time>`).join(` &mdash; `)}
                </p>
                <p class="event__duration">${this._duration}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${this._price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                  ${this._offers.filter((offer) => offer.accepted).slice(0, 3).map((offer) => `<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    +
                    &euro;
                    <span class="event__offer-price">${offer.price}</span>
                </li>`).join(``)}
              </ul>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>`;
  }
}

export {Point as default};
