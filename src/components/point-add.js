import AbstractComponent from "./abstract-component";
import {cities} from "../site-data";
import {prepositionMap} from "../utils";
import {pointTypes} from "./point-edit";
import moment from "moment";

export default class extends AbstractComponent {
  constructor({type, city, dates, price, options, description, photos}) {
    super();
    this._type = `${type[0].toUpperCase()}${type.slice(1)}`;
    this._preposition = prepositionMap[type];
    this._cities = cities;
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._options = options;
    this._description = description;
    this._photos = Array.from(photos);
  }

  getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  ${Object.keys(pointTypes).map((group) => `<fieldset class="event__type-group">
                      <legend class="visually-hidden">${group}</legend>
                      ${pointTypes[group].map((type) => `
                      <div class="event__type-item">
                        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" 
                        ${type === this._type.toLowerCase() ? `checked` : ``} >
                        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
                      </div>
                    `).join(``)}
                     </fieldset>
                   `).join(``)}
                  </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${this._type} ${this._preposition} 
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${this._cities.map((city) => `<option value="${city}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                ${Object.keys(this._dates).map((stage) => `<label class="visually-hidden" for="event-start-${stage}-1">${prepositionMap[stage]}</label>
                  <input class="event__input  event__input--time" id="event-${stage}-time-1" type="text" name="event-${stage}-time"
                  value="${moment(this._dates[stage]).format(`DD.MM.YYYY HH:mm`)}">
                  `).join(` &mdash; `)}
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
          </form>`;
  }
}
