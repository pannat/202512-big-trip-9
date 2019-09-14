import {Key, Position, render, unrender} from "../utils";
import AbstractPointController from "./abstract-point";
import PointAdd from "../components/point-add";


export default class extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView) {
    super(container, data, onDataChange, onChangeView, PointAdd);

    this.create();
  }

  create() {
    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        unrender(this._pointEdit.getElement());
        this._pointEdit.removeElement();
      }
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._onChangeView();
    this._initializeCalendars();

    this._pointEdit.getElement().querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      unrender(this._pointEdit.getElement());
      this._pointEdit.removeElement();
    });

    this._pointEdit.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(this._createNewData(), null);
    });

    document.addEventListener(`keydown`, onEscKeyDown);

    render(this._container, this._pointEdit.getElement(), Position.AFTERBEGIN);
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      unrender(this._pointEdit.getElement());
      this._pointEdit.removeElement();
    }
  }
}
