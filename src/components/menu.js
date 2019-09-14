import AbstractComponent from "./abstract-component";

export default class extends AbstractComponent {

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a data-menu-item="Table" class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
        <a data-menu-item="Stats" class="trip-tabs__btn" href="#">Stats</a>
   </nav>`;
  }
}
