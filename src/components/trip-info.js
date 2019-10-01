import AbstractComponent from "./abstract-component";

class TripInfo extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title"></h1>
            <p class="trip-info__dates"></p>
      </div>`;
  }
}

export {TripInfo as default};
