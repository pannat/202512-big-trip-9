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
    this._fieldDestination = this._pointEdit.getElement().querySelector(`.event__input--destination`);
    this._create();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._closeCardEdit();
    }
  }

  _create() {
    if (this._data.offers.length) {
      render(this._containerEventDetails, this._offersComponent.getElement(), Position.AFTERBEGIN);
    }

    render(this._containerEventDetails, this._destinationComponent.getElement(), Position.BEFOREEND);

    this._pointView.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      this._openCardEdit();
    });

    this._pointEdit.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      this._closeCardEdit();
    });

    this._pointEdit.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const newData = this._createNewData();
      this._onSubmit(newData);
    });

    this._pointEdit.getElement().
    querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(`delete`, this._data);
    });

    render(this._container, this._pointView.getElement(), Position.AFTERBEGIN);
  }

  _undoEventType(input) {
    this._changePointType(this._data.type);
    input.checked = false;
    this._pointEdit.getElement().querySelector(`#event-type-${this._data.type}-1`).checked = true;
    this._updateOffersForCurrentType(this._data.offers);
  }

  _undoDestinationCity() {
    this._fieldDestination.value = this._data.city;

    this._updateDestinationForCurrentCity(this._data);
  }

  _openCardEdit() {
    this._onChangeView();
    this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
    this._initializeCalendars();
    document.addEventListener(`keydown`, (evt) => this._onEscKeyDown(evt));
  }

  _closeCardEdit() {
    this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());

    if (this._fieldDestination.value !== this._data.city) {
      this._undoDestinationCity();
    }

    const checkedTypeInput = this._pointEdit.getElement().querySelector(`.event__type-input:checked`);
    if (checkedTypeInput.value !== this._data.type) {
      this._undoEventType(checkedTypeInput);
    }

    const priceInput = this._pointEdit.getElement().querySelector(`.event__input--price`);
    if (Number(priceInput.value) !== this._data.price) {
      priceInput.value = this._data.price;
    }

    const isFavoriteInput = this._pointEdit.getElement().querySelector(`.event__favorite-checkbox`);
    if (isFavoriteInput.checked !== this._data.isFavorite) {
      isFavoriteInput.checked = this._data.isFavorite;
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
      if (this._container.contains(this._pointEdit.getElement())) {
        this._closeCardEdit();
      }
    }
  }

  _onSubmit(newData) {
    Object.assign(this._data, newData);
    this._onDataChange(Action.UPDATE, this._data);
  }
}

export {PointController as default};
