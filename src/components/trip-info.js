import AbstractComponent from "./abstract-component";

class TripInfo extends AbstractComponent {
  constructor(setTitle, setDates) {
    super();
    this._tripInfoTitleElement = this.element.querySelector(`.trip-info__title`);
    this._tripInfoDatesElement = this.element.querySelector(`.trip-info__dates`);
    this._setTitle = setTitle;
    this._setDates = setDates;
  }

  get template() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title"></h1>
            <p class="trip-info__dates"></p>
      </div>`;
  }

  update() {
    this._tripInfoTitleElement.textContent = this._setTitle();
    this._tripInfoDatesElement.textContent = this._setDates();
  }

  reset() {
    this._tripInfoTitleElement.textContent = ``;
    this._tripInfoDatesElement.textContent = ``;
  }
}

export {TripInfo as default};
