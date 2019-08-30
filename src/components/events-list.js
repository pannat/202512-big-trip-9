import SuperClass from "./super-class";

export default class extends SuperClass {
  constructor(dates) {
    super();
    this._unicueDates = dates;
  }

  getTemplate() {
    return `<ul class="trip-days">
            ${this._unicueDates.map((date, count) => `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${count + 1}</span>
                 <time class="day__date" datetime="${new Date(date).toISOString().slice(0, 10)}">${date.slice(3, 10)}</time>
              </div>
              <ul class="trip-events__list">
              </ul>
            </li>`).join(``)}
        </ul>`;
  }
}

