import AbstractComponent from "./abstract-component";
import {groupToType, getPreposition} from "../utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

class AbstractPoint extends AbstractComponent {
  constructor({type, city, dates, price, isFavorite}, destinationCities = []) {
    super();
    this._containerEventDetails = null;
    this._choosenType = type ? type : ``;
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._isFavorite = isFavorite;
    this._destinationCities = destinationCities;
    this._groupToType = groupToType;
    this._preposition = getPreposition(type);
    this._stageToPreposition = {
      start: `From`,
      end: `To`
    };

    if (new.target === AbstractPoint) {
      throw new Error(`Can't instantiate AbstractPoint, only concrete one.`);
    }
  }

  get ContainerEventDetails() {
    this._containerEventDetails = this.getElement().querySelector(`.event__details`);
    return this._containerEventDetails;
  }

  initializeCalendars() {
    flatpickr(this.getElement().querySelector(`input[name=event-start-time]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      [`time_24hr`]: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._dates.start,
      onChange(selectedDates) {
        calendarEnd.config.minDate = new Date(selectedDates);
      }
    });

    const calendarEnd = flatpickr(this.getElement().querySelector(`input[name=event-end-time]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      [`time_24hr`]: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._dates.end,
      minDate: this._dates.start,
    });
  }

  setClassForContainerEventDetails() {
    if (this._containerEventDetails.hasChildNodes()) {
      this._containerEventDetails.classList.remove(`visually-hidden`);
    } else {
      this._containerEventDetails.classList.add(`visually-hidden`);
    }
  }

  disabledForm() {
    const inputs = this._element.querySelectorAll(`input`);
    inputs.forEach((input) => {
      input.disabled = true;
    });

    this._element.querySelector(`.event__rollup-btn`).disabled = true;
    this._element.querySelector(`.event__reset-btn`).disabled = true;
    const saveButton = this._element.querySelector(`.event__save-btn`);
    saveButton.disabled = true;
    saveButton.textContent = `Saving....`;
  }

  setSelectedType(type) {
    this._uncheckedTypeInput();
    this._element.querySelector(`.event__type-output`).textContent = `${type} ${getPreposition(type)}`;
    this._element.querySelector(`.event__type-icon`).src = `img/icons/${type.toLowerCase()}.png`;
  }

  _uncheckedTypeInput() {
    this._element.querySelector(`.event__type-toggle`).checked = false;
  }
}

export {AbstractPoint as default};
