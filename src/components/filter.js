import AbstractComponent from "./abstract-component";

class Filter extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return `<form class="trip-filters" action="#" method="get">
              <div class="trip-filters__filter">
                <input data-filter-type="everything" id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
                <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
              </div>

              <div class="trip-filters__filter">
                <input data-filter-type="future" id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
                <label class="trip-filters__filter-label" for="filter-future">Future</label>
              </div>

              <div class="trip-filters__filter">
                <input data-filter-type="past" id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
                <label class="trip-filters__filter-label" for="filter-past">Past</label>
              </div>

              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
  }

  get checkedItem() {
    this._checkedItem = this.element.querySelector(`.trip-filters__filter-input:checked`);
    return this._checkedFilter;
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }
}

export {Filter as default};
