import AbstractComponent from "./abstract-component";

class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day">Day</span>
            <div class="trip-sort__item  trip-sort__item--event">
              <input data-sort-type="event" id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>
            <div class="trip-sort__item  trip-sort__item--time">
              <input data-sort-type="time" id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
              <label class="trip-sort__btn" for="sort-time">
                Time
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>
            <div class="trip-sort__item  trip-sort__item--price">
              <input data-sort-type="price" id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
              <label class="trip-sort__btn" for="sort-price">
                Price
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>
            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>`;
  }

  get checkedItem() {
    this._checkedItem = this.element.querySelector(`.trip-sort__input:checked`);
    return this._checkedItem;
  }


  checkAvailable() {
    if (this.element.classList.contains(`visually-hidden`)) {
      this.element.classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }
}

export {Sort as default};
