import {Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import AbstractPointController from "./abstract-point";


export default class extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView) {
    super(container, data, onDataChange, onChangeView, PointEdit);
    this._pointView = new Point(data);
    this._create();
  }

  _create() {
    const openCardEdit = () => {
      this._onChangeView();
      this._initializeCalendars();
      this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
    };
    const closeCardEdit = () => {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        if (this._container.contains(this._pointEdit.getElement())) {
          closeCardEdit();
        }
      }
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._pointView.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      openCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._pointEdit.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      closeCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._pointEdit.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      const newData = this._createNewData();
      if (newData === this._data) {
        closeCardEdit();
      } else {
        this._onDataChange(newData, this._data);
      }

      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._pointEdit.getElement().
    querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(null, this._data);
    });

    render(this._container, this._pointView.getElement(), Position.AFTERBEGIN);
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
    }
  }
}
