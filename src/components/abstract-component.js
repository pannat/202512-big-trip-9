import {createElement} from "../utils";

class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    throw new Error(`Abstract method not implemented: get template`);
  }

  removeElement() {
    this._element = null;
  }
}

export {AbstractComponent as default};


