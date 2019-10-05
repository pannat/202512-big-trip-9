import AbstractComponent from "./abstract-component";
import {groupToType, InputName, getPreposition} from "../utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

class AbstractPoint extends AbstractComponent {
  constructor({type, city, dates, price, isFavorite}, destinationCities = []) {
    super();
    this._containerEventDetails = null;
    this._choosenType = type;
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
    this._resetButton = null;
    this._inputs = null;
    this._saveButton = null;
    this._calendarStart = null;
    this._calendarEnd = null;


    if (new.target === AbstractPoint) {
      throw new Error(`Can't instantiate AbstractPoint, only concrete one.`);
    }
  }

  get resetButton() {
    if (!this._resetButton) {
      this._resetButton = this.element.querySelector(`.event__reset-btn`);
    }
    return this._resetButton;
  }

  get containerEventDetails() {
    return this._containerEventDetails = this.element.querySelector(`.event__details`);
  }

  applyClassForContainerEventDetails() {
    if (this.containerEventDetails.hasChildNodes()) {
      this._containerEventDetailsShow();
    } else {
      this._containerEventDetailsHide();
    }
  }

  applySelectedType(type) {
    this._toggleTypeInput.checked = false;
    this._choosenType = type;
    this._partialUpdate();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  changeTextSaveButton(text) {
    this._saveButton.textContent = text;
  }

  disableForm() {
    throw new Error(`Abstract method not implemented: disabledForm`);
  }

  shake() {
    this.element.classList.add(`shake`);
  }

  highlight() {
    this.element.style.border = `2px solid red`;
  }

  removeAnimation() {
    this.element.classList.remove(`shake`);
  }

  initializeCalendars() {
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

  destroyCalendars() {
    this._calendarEnd.destroy();
    this._calendarStart.destroy();
  }

  _containerEventDetailsShow() {
    this._containerEventDetails.classList.remove(`visually-hidden`);
  }

  _containerEventDetailsHide() {
    this._containerEventDetails.classList.add(`visually-hidden`);
  }

  _disableInputs(isDisabled) {
    if (!this._inputs) {
      this._inputs = this.element.querySelectorAll(`input`);
    }

    this._inputs.forEach((input) => {
      input.disabled = isDisabled;
    });
  }

  _disableRollupButton(isDisabled) {
    this.rollupButton.disabled = isDisabled;
  }

  _disableButtons(isDisabled) {
    if (!this._saveButton) {
      this._saveButton = this.element.querySelector(`.event__save-btn`);
    }
    this.resetButton.disabled = isDisabled;
    this._saveButton.disabled = isDisabled;
  }

  _removeHighlight() {
    this.element.style.border = `none`;
  }
}

export {AbstractPoint as default};
