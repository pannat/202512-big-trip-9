import AbstractComponent from "./abstract-component";
import {cities} from "../site-data";
import {prepositionMap} from "../utils";
import moment from "moment";

export const pointTypes = {
  transfer:
    [
      `Taxi`,
      `Bus`,
      `Train`,
      `Ship`,
      `Transport`,
      `Drive`,
      `Flight`,
    ],
  activity:
    [
      `Check-in`,
      `Sightseeing`,
      `Restaurant`
    ]
};

export default class extends AbstractComponent {
  constructor({type, city, dates, price, options, description, photos}) {
    super();
    this._type = type;
    this._keyType = Object.keys(type)[0];
    this._cities = cities;
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._options = options;
    this._description = description;
    this._photos = Array.from(photos);
  }

  getTemplate() {
    return `<form class="event  event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type[this._keyType].toLowerCase()}.png"
                    alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  <div class="event__type-list">
                  ${Object.keys(pointTypes).map((group) => `<fieldset class="event__type-group">
                      <legend class="visually-hidden">${group}</legend>
                      ${pointTypes[group].map((type) => `
                      <div class="event__type-item">
                        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" 
                        ${type === this._type[this._keyType] ? `checked` : ``} >
                        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
                      </div>
                    `).join(``)}
                     </fieldset>
                   `).join(``)}
                  </div>
                </div>
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                     ${this._type[this._keyType]} ${prepositionMap[[this._keyType]]} 
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
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" 
                  value="${this._price}">
                </div>
                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
                <label class="event__favorite-btn" for="event-favorite-1">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </label>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                  ${this._options.map((option) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.title}-1" type="checkbox" name="event-offer-${option.title}" 
                      ${option.isApplied ? `checked` : ``}>
                      <label class="event__offer-label" for="event-offer-${option.title}-1">
                        <span class="event__offer-title">${option.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
                      </label>
                    </div>`).join(``)}
                  </div>
                </section>
                <section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${this._description}</p>

                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${this._photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
                    </div>
                  </div>
                </section>
              </section>
            </form>`;
  }
}
