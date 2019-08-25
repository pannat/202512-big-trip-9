import {createElement} from "./utils";

export default class {
  constructor(Mocks) {
    this._title = this.getTripTitle(Mocks);
    this._dates = this.getTripDates(Mocks);
    this._element = null;
  }

  getTripTitle(Mocks) {
    let citiesSet = new Set();
    Mocks.slice().sort((a, b) => a.date - b.date).map((Mock) => citiesSet.add(Mock.city));
    let citiesArr = Array.from(citiesSet);
    return citiesArr.length === 3 ? `${citiesArr[0]} &mdash; ${citiesArr[1]} &mdash; ${citiesArr[2]}` : `${citiesArr[0]} &mdash; ... &mdash; ${citiesArr[citiesArr.length - 1]}`;
  }

  getTripDates(Mocks) {
    let setDates = new Set();
    Mocks.slice().sort((a, b) => a.date - b.date).map((Mock) => setDates.add(new Date(Mock.date).toDateString()));
    let dates = Array.from(setDates);
    return `${dates[0].slice(4, 11)} &mdash; ${dates[dates.length - 1].slice(7, 11)}`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title">${this._title}</h1>
            <p class="trip-info__dates">${this._dates}</p>
      </div>`;
  }
}
