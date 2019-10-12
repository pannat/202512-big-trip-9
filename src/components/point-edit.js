import {Position, groupToType, InputName, render, unrender, getPreposition} from "../utils";
import moment from "moment";
import dompurify from "dompurify";
import {availableDestinations, availableOffers} from "../main";
import AbstractComponent from "./abstract-component";
import OffersComponent from "./offers";
import DestinationComponent from "./destination";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

class PointEdit extends AbstractComponent {
  constructor({type, city, dates, price, offers, description, pictures, isFavorite}) {
    super();
    this._choosenType = type;
    this._preposition = getPreposition(type);
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._offers = offers;
    this._destination = {description, pictures};
    this._isFavorite = isFavorite;
    this._stageToPreposition = {
      start: `From`,
      end: `To`
    };

    this._toggleTypeInput = null;
    this._typeLabel = null;
    this._cityInput = null;
    this._favoriteCheckbox = null;

    this._rollupButton = this.element.querySelector(`.event__rollup-btn`);
    this._containerEventDetails = this.element.querySelector(`.event__details`);


    this._isTypeChanged = false;
    this._isCityChanged = false;
    this._isPriceChanged = false;
    this._isFavoriteChanged = false;

    this._offersComponent = new OffersComponent(offers);
    this._destinationComponent = new DestinationComponent(this._destination);

    this._onSubmit = null;
    this._onEscKeyDown = null;
    this._close = null;
    this._open = null;
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this._onChangeForm = this._onChangeForm.bind(this);

    this.init();
  }

  init() {
    render(this._containerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
    render(this._containerEventDetails, this._destinationComponent.element, Position.BEFOREEND);
  }

  get template() {
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
                  ${Object.keys(groupToType).map((group) => `<fieldset class="event__type-group">
                      <legend class="visually-hidden">${group}</legend>
                      ${groupToType[group].map((type) => `
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
                    ${availableDestinations.map(({name}) => `<option value="${dompurify.sanitize(name)}"></option>`).join(``)}
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

  set close(fn) {
    this._close = fn;
  }

  set open(fn) {
    this._open = fn;
  }

  set onEscKeyDown(fn) {
    this._onEscKeyDown = fn;
  }

  _onChangeForm(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    switch (evt.target.name) {
      case InputName.TYPE:
        if (!this._isTypeChanged) {
          this._isTypeChanged = true;
        }

        const selectedType = evt.target.value;
        this._applySelectedType(selectedType);
        const offersForSelectedType = availableOffers.find((it) => it.type === selectedType.toLowerCase()).offers;
        this._updateOffersComponent(offersForSelectedType);
        break;
      case InputName.DESTINATION:
        if (!this._isCityChanged) {
          this._isCityChanged = true;
        }
        const selectedCity = evt.target.value;
        const destinationForSelectedCity = availableDestinations.find((it) => it.name === selectedCity);
        this._updateDestinationComponent(destinationForSelectedCity);
        break;
      case InputName.PRICE:
        if (!this._isPriceChanged) {
          this._isPriceChanged = true;
        }
        break;
      case InputName.FAVORITE:
        if (!this._isFavoriteChanged) {
          this._isFavoriteChanged = true;
        }
        break;
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  onClose() {
    this._close();
    this.unbind();
  }

  onOpen() {
    this._open();
    this.bind();

    if (this._isTypeChanged) {
      this._isTypeChanged = false;
      this._applySelectedType(this._choosenType);
    }
    this._updateOffersComponent(this._offers);

    if (this._isCityChanged) {
      this._isCityChanged = false;
      this._revertCity();
    }

    if (this._isPriceChanged) {
      this._isPriceChanged = false;
      this._revertPrice();
    }

    if (this._isFavoriteChanged) {
      this._isFavoriteChanged = false;
      this._revertIsFavorite();
    }
  }

  _revertCity() {
    if (!this._cityInput) {
      this._cityInput = this._element.querySelector(`.event__input--destination`);
    }
    this._cityInput.value = this._city;
    this._updateDestinationComponent(this._destination);
  }

  _revertPrice() {
    if (!this._priceInput) {
      this._priceInput = this._element.querySelector(`.event__input--price`);
    }
    this._priceInput.value = this._price;
  }

  _revertIsFavorite() {
    if (!this._favoriteCheckbox) {
      this._favoriteCheckbox = this._element.querySelector(`.event__favorite-checkbox`);
    }
    this._favoriteCheckbox.checked = this._isFavorite;
  }

  _applySelectedType(type) {
    if (!this._toggleTypeInput) {
      this._toggleTypeInput = this._element.querySelector(`.event__type-toggle`);
    }

    if (!this._typeLabel) {
      this._typeLabel = this._element.querySelector(`.event__type-output`);
    }

    this._toggleTypeInput.checked = false;
    this._element.querySelector(`#event-type-${type}-1`).checked = true;
    this._typeLabel.textContent = `${type} ${getPreposition(type)}`;
  }

  _updateOffersComponent(data) {
    unrender(this._offersComponent.element);
    this._offersComponent.removeElement();
    if (data.length) {
      this._offersComponent = new OffersComponent(data);
      render(this._containerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
    }
    this._toggleAvailableEventDetails()
  }

  _updateDestinationComponent(data) {
    unrender(this._destinationComponent.element);
    this._destinationComponent.removeElement();
    if (data) {
      this._destinationComponent = new DestinationComponent(data);
      render(this._containerEventDetails, this._destinationComponent.element, Position.BEFOREEND);
    }
    this._toggleAvailableEventDetails();
  }

  _toggleAvailableEventDetails() {
    if (this._containerEventDetails.hasChildNodes()) {
      this._containerEventDetails.classList.remove(`visually-hidden`);
    } else {
      this._containerEventDetails.classList.add(`visually-hidden`);
    }
  }

  bind() {
    this._initializeCalendars();
    this._element.addEventListener(`change`, this._onChangeForm);
    this._element.addEventListener(`submit`, this._onSubmit);
    this._rollupButton.addEventListener(`click`, this.onClose);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  unbind() {
    this._destroyCalendars();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _initializeCalendars() {
    this._calendarEnd = flatpickr(this.element.querySelector(`input[name=${InputName.END_TIME}]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      [`time_24hr`]: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._dates.end,
      minDate: this._dates.start,
    });

    this._calendarStart = flatpickr(this.element.querySelector(`input[name=${InputName.START_TIME}]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      [`time_24hr`]: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._dates.start,
      onChange(selectedDates) {
        this._calendarEnd.config.minDate = new Date(selectedDates);
      }
    });
  }

  _destroyCalendars() {
    this._calendarEnd.destroy();
    this._calendarStart.destroy();
  }

  changeTextResetButton(text) {
    this._resetButton.textContent = text;
  }

  disableForm(isDisabled) {
    this._disableInputs(isDisabled);
    this._disableRollupButton(isDisabled);
    this._disableButtons(isDisabled);
  }
}

export {PointEdit as default};
