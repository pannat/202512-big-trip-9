import AbstractComponent from "./abstract-component";

class Menu extends AbstractComponent {
  constructor() {
    super();
    this._menuItemTable = this.getElement().querySelector(`[data-menu-item = table]`);
    this._menuItemStats = this.getElement().querySelector(`[data-menu-item = stats]`);
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a data-menu-item="table" class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
        <a data-menu-item="stats" class="trip-tabs__btn" href="#">Stats</a>
   </nav>`;
  }

  setActiveButtonTable() {
    this._menuItemTable.classList.add(`trip-tabs__btn--active`);
    this._menuItemStats.classList.remove(`trip-tabs__btn--active`);
  }

  setActiveButtonStats() {
    this._menuItemTable.classList.remove(`trip-tabs__btn--active`);
    this._menuItemStats.classList.add(`trip-tabs__btn--active`);
  }
}

export {Menu as default};

