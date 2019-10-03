import AbstractComponent from "./abstract-component";
import moment from "moment";

class Day extends AbstractComponent {
  constructor(pointsNumber, date, dayNumber) {
    super();
    this._date = date;
    this._dayNumber = dayNumber;
    this._pointsNumber = pointsNumber;
    this._pointsContainers = null;
  }

  get template() {
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._dayNumber === undefined ? `` : this._dayNumber + 1}</span>
                 <time class="day__date" datetime="${this._date ? moment(new Date(this._date)).format(`YYYY-MM-DD`) : ``}">
                    ${this._date ? this._date.slice(0, 6) : ``}</time>
              </div>
              <ul class="trip-events__list">
                ${new Array(this._pointsNumber).fill(``).map(() => `<li class="trip-events__item"></li>`).join(``)}
              </ul>
            </li>`;
  }

  get eventsItem() {
    if (!this._pointsContainers) {
      this._pointsContainers = this.element.querySelectorAll(`.trip-events__item`);
    }
    return this._pointsContainers;
  }
}

export {Day as default};
