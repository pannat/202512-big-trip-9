import {createElement} from "../utils";

export default class SuperClass {
  constructor() {
    this._element = null;
    if (new.target === SuperClass) {
      throw new Error(`Can't instantiate SuperClass, only concrete one.`);
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }
}

