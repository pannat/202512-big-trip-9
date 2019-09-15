import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="trip-info__main">
            <h1 class="trip-info__title"></h1>
            <p class="trip-info__dates">${moment().format(`MMM DD`)} &mdash; ${moment().format(`DD MMM`)}</p>
      </div>`;
  }
}
