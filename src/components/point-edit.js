import moment from "moment";
import AbstractPoint from "./abstract-point";

class PointEdit extends AbstractPoint {
  constructor({type, city, dates, price, offers, description, pictures, isFavorite}, destinationCities) {
    super({type, city, dates, price, offers, description, pictures, isFavorite}, destinationCities);
  }

  getTemplate() {
    return `<form class="event  event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${this._choosenType.toLowerCase()}.png"
                    alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  <div class="event__type-list">
                  ${Object.keys(this._groupToType).map((group) => `<fieldset class="event__type-group">
                      <legend class="visually-hidden">${group}</legend>
                      ${this._groupToType[group].map((type) => `
                      <div class="event__type-item">
                        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" 
                        ${type === this._choosenType ? `checked` : ``} >
                        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${type[0].toUpperCase()}${type.slice(1)}</label>
                      </div>
                    `).join(``)}
                     </fieldset>
                   `).join(``)}
                  </div>
                </div>
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                     ${this._choosenType} ${this._preposition} 
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${this._destinationCities.map((city) => `<option value="${city}"></option>`).join(``)}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  ${Object.keys(this._dates).map((stage) => `<label class="visually-hidden" for="event-start-${stage}-1">${this._stageToPreposition[stage]}</label>
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
                <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
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
              <section class="event__details"></section>
            </form>`;
  }
}

export {PointEdit as default};
