import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class extends AbstractComponent {
  constructor(pointMocks) {
    super();
    this._mocks = pointMocks;
  }

  _getTripTitle() {
    let uniqueCities = new Set();
    this._mocks.forEach((mock) => uniqueCities.add(mock.city));
    let cities = Array.from(uniqueCities);
    return cities.length === 3 ? `${cities[0]} &mdash; ${cities[1]} &mdash; ${cities[2]}` : `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  }

  _getTripDates() {
    return `${moment(this._mocks[0].date).format(`MMM DD`)} &mdash; ${moment(this._mocks[this._mocks.length - 1].date).format(`DD MMM`)}`;
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title">${this._getTripTitle()}</h1>
            <p class="trip-info__dates">${this._getTripDates()}</p>
      </div>`;
  }
}
