import SuperClass from "./super-class";

export default class extends SuperClass {
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
    let uniqueDates = new Set();
    this._mocks.forEach((mock) => uniqueDates.add(new Date(mock.date).toDateString()));
    let dates = Array.from(uniqueDates);
    return `${dates[0].slice(4, 11)} &mdash; ${dates[dates.length - 1].slice(7, 11)}`;
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title">${this._getTripTitle()}</h1>
            <p class="trip-info__dates">${this._getTripDates()}</p>
      </div>`;
  }
}
