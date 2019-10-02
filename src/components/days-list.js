import AbstractComponent from "./abstract-component";

class DaysList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

export {DaysList as default};

