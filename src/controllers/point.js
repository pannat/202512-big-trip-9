import {Key, Position, render, unrender} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import AbstractPointController from "./abstract-point";


export default class extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView) {
    super(container, data, onDataChange, onChangeView, PointEdit);
    this._data = data;
    this._pointView = new Point(data);
    this._create();
  }

  _create() {
    render(this._containerEventDetails, this._offersComponent.getElement(), Position.AFTERBEGIN);
    render(this._containerEventDetails, this._destinationComponent.getElement(), Position.BEFOREEND);

    // const undoEventType = (input) => {
    //   this._changePointType(this._data.type);
    //   input.checked = false;
    //   this._pointEdit.getElement().querySelector(`#event-type-${this._data.type}-1`).checked = true;
    //   this._updateOffersForCurrentType(this._data.options);
    // };
    //
    // const undoDestinationCity = () => {
    //   this._fieldDestination.value = this._data.city;
    //
    //   unrender(this._destinationComponent.getElement());
    //   this._destinationComponent.removeElement();
    //   this._createDestination(this._data);
    // };
    //
    // const cancelChange = () => {
    //   if (this._fieldDestination.value !== this._data.city) {
    //     undoDestinationCity();
    //   }
    //
    //   const checkedTypeInput = this._pointEdit.getElement().querySelector(`.event__type-input:checked`);
    //   if (checkedTypeInput.value !== this._data.type) {
    //     undoEventType(checkedTypeInput);
    //   }
    // };

    const openCardEdit = () => {
      this._onChangeView();
      this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
      this._initializeCalendars();
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
          // cancelChange();
        }
      }
    };

    this._pointView.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      openCardEdit();
    });

    this._pointEdit.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      closeCardEdit();
      // cancelChange();
    });

    this._pointEdit.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const newData = this._createNewData();
      onSubmit(newData);
    });

    const onSubmit = (newData) => {
      Object.assign(this._data, newData);
      this._onDataChange(`update`, this._data);
    };

    this._pointEdit.getElement().
    querySelector(`.event__reset-btn`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(`delete`, this._data);
    });

    render(this._container, this._pointView.getElement(), Position.AFTERBEGIN);
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
    }
  }
}
