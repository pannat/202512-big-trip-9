import {Key, Position, render, unrender} from "../utils";
import AbstractPointController from "./abstract-point";
import PointAdd from "../components/new-point";

class NewPointController extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, removeNewPoint) {
    super(container, data, onDataChange, onChangeView, PointAdd);
    this._removeNewPoint = removeNewPoint;

    this._create();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._closeNewPoint();
    }
  }

  _create() {
    this._onChangeView();
    this._initializeCalendars();

    this._pointEdit.getElement().querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._closeNewPoint();
    });

    this._pointEdit.getElement().querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onDataChange(`create`, Object.assign(this._data, this._createNewData()));
      });
    document.addEventListener(`keydown`, (evt) => this._onEscKeyDown(evt));
    render(this._container, this._pointEdit.getElement(), Position.AFTERBEGIN);
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
      this._closeNewPoint();
    }
  }

  _closeNewPoint() {
    unrender(this._pointEdit.getElement());
    this._pointEdit.removeElement();
    this._removeNewPoint();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}

export {NewPointController as default};
