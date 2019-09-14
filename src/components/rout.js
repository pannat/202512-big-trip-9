import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class extends AbstractComponent {
  constructor(points) {
    super();
    this._pointsSortedByStartDate = points.slice(0).sort((a, b) => a.dates.start - b.dates.start);
    this._pointsSortedByEndDate = points.slice(0).sort((a, b) => b.dates.end - a.dates.end);
    this._startTtipDate = this._pointsSortedByStartDate[0].dates.start;
    this._endTripDate = this._pointsSortedByEndDate[0].dates.end;
  }

  _getUniqueCities(points) {
    const uniqueCities = new Set();
    points.forEach((point) => uniqueCities.add(point.city));
    return Array.from(uniqueCities);
  }

  _getTripTitle() {
    const citiesSortedByStart = this._getUniqueCities(this._pointsSortedByStartDate);
    const citiesSortedByEnd = this._getUniqueCities(this._pointsSortedByEndDate);
    return citiesSortedByStart.length === 3 ? `${citiesSortedByStart[0]} &mdash; ${citiesSortedByStart[1]} &mdash; ${citiesSortedByStart[2]}`
      : `${citiesSortedByStart[0]} &mdash; ... &mdash; ${citiesSortedByEnd[0]}`;
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title">${this._getTripTitle()}</h1>
            <p class="trip-info__dates">${moment(this._startTtipDate).format(`MMM DD`)} &mdash; ${moment(this._endTripDate).format(`DD MMM`)}</p>
      </div>`;
  }
}
