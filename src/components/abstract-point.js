import AbstractComponent from "./abstract-component";
import {groupToType, InputName, getPreposition, unrender, render, Position} from "../utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import OffersComponent from "./offers";
import DestinationComponent from "./destination";

class AbstractPoint extends AbstractComponent {
  constructor({type, city, dates, price, isFavorite}) {
    super();

    this._choosenType = type;
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._isFavorite = isFavorite;
    this._groupToType = groupToType;
    this._preposition = getPreposition(type);
    this._stageToPreposition = {
      start: `From`,
      end: `To`
    };
    this._containerEventDetails = null;
    this._toggleTypeInput = null;
    this._typeLabel = null;


    if (new.target === AbstractPoint) {
      throw new Error(`Can't instantiate AbstractPoint, only concrete one.`);
    }
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
    this._toggleAvailableEventDetails();
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
}

export {AbstractPoint as default};
