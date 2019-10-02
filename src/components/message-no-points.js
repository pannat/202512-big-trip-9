import AbstractComponent from "./abstract-component";

class MessageNoPoints extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}

export {MessageNoPoints as default};
