import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class extends AbstractComponent {
  constructor(pointsNumber, date = undefined, dayNumber = undefined) {
    super();
    this._date = date;
    this._dayNumber = dayNumber;
    this._pointsNumber = pointsNumber;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._dayNumber === undefined ? `` : this._dayNumber + 1}</span>
                 <time class="day__date" datetime="${this._date ? moment(this._date).format(`YYYY-MM-DD`) : ``}">
                    ${this._date ? this._date.slice(0, 6) : ``}</time>
              </div>
              <ul class="trip-events__list">
                ${new Array(this._pointsNumber).fill(``).map(() => `<li class="trip-events__item"></li>`).join(``)}
              </ul>
            </li>`;
  }
}
