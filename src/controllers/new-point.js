import {Key, Position, render, unrender} from "../utils";
import AbstractPointController from "./abstract-point";
import PointAdd from "../components/point-add";

export default class extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, removeNewPoint) {
    super(container, data, onDataChange, onChangeView, PointAdd);
    this._removeNewPoint = removeNewPoint;

    this._create();
  }

  _create() {
    const closeNewPoint = () => {
      unrender(this._pointEdit.getElement());
      this._pointEdit.removeElement();
      this._removeNewPoint();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        closeNewPoint();
      }
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._onChangeView();
    this._initializeCalendars();

    this._pointEdit.getElement().querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      closeNewPoint();
    });

    this._pointEdit.getElement().querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onDataChange(`create`, this._createNewData());
      });

    this._listPointType.addEventListener(`change`, () => this._checkAvailableContainer());
    this._fieldDestination.addEventListener(`change`, () => this._checkAvailableContainer());

    document.addEventListener(`keydown`, onEscKeyDown);

    render(this._container, this._pointEdit.getElement(), Position.AFTERBEGIN);
  }

  _checkAvailableContainer() {
    if (this._containerEventDetails.classList.contains(`visually-hidden`)) {
      this._containerEventDetails.classList.remove(`visually-hidden`);
    }
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      unrender(this._pointEdit.getElement());
      this._pointEdit.removeElement();
      this._removeNewPoint();
    }
  }
}
