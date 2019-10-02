import {Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import AbstractPointController from "./abstract-point";
import {Action} from "../main";


class PointController extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView) {
    super(container, data, onDataChange, onChangeView, PointEdit);
    this._data = data;
    this._pointView = new Point(data);
    this._actionType = Action.UPDATE;
    this._create();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.element)) {
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    }
  }

  _create() {
    const openCardEdit = () => {
      this._onChangeView();
      this._pointEdit.revertDestination(this._updateDestinationForCurrentCity.bind(this));
      this._pointEdit.revertType(this._updateOffersForCurrentType.bind(this));
      this._pointEdit.revertPrice();
      this._pointEdit.revertFavorite();
      this._pointEdit.initializeCalendars();
      this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeCardEdit = () => {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        if (this._container.contains(this._pointEdit.getElement())) {
          closeCardEdit();
        }
      }
    };

    const onSubmit = (evt) => {
      evt.preventDefault();
      Object.assign(this._data, this._createNewData());
      this._pointEdit.disabledForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
      this._onDataChange(this._actionType, this._data);
    };

    const onDeleteButtonClick = (evt) => {
      evt.preventDefault();
      this._onDataChange(Action.DELETE, this._data);
    };

    if (this._data.offers.length) {
      render(this._pointEdit.ContainerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
    }

    render(this._pointEdit.ContainerEventDetails, this._destinationComponent.element, Position.BEFOREEND);

    this._pointView.element.
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      openCardEdit();
    });

    this._pointEdit.element.
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      closeCardEdit();
    });

    this._pointEdit.element.addEventListener(`submit`, onSubmit);

    this._pointEdit.element
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onDeleteButtonClick);

    render(this._container, this._pointView.element, Position.AFTERBEGIN);
  }
}

export {PointController as default};
