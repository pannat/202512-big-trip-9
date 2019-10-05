import {InputName, Key, Position, render, unrender} from "../utils";
import AbstractPointController from "./abstract-point";
import PointAdd from "../components/point-new";
import {Action} from "../main";

class NewPointController extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, removePointNew) {
    super(container, data, onDataChange, onChangeView, PointAdd);
    this._removePointNew = removePointNew;

    this._init();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.element)) {
      this._closeNewPoint();
    }
  }

  _init() {
    const onChangeForm = (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      switch (evt.target.name) {
        case InputName.TYPE:
          const currentType = evt.target.value;
          this._pointEdit.applySelectedType(currentType);
          this._updateOffersForCurrentType(evt.target.value);
          this._pointEdit.applyClassForContainerEventDetails();
          break;

        case InputName.DESTINATION:
          this._updateDestinationForCurrentCity(evt.target.value);
          this._pointEdit.applyClassForContainerEventDetails();
          break;
      }
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        this._closeNewPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onSubmit = (evt) => {
      evt.preventDefault();
      this._data.update(this._createNewData());
      this._onDataChange(Action.CREATE, this._data, () => {
        this._onError();
        this._pointEdit.changeTextSaveButton(`Save`);
      });
      this._pointEdit.disableForm(true);
      this._pointEdit.changeTextSaveButton(`Saving...`);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._onChangeView();
    this._pointEdit.initializeCalendars();

    this._pointEdit.element.addEventListener(`change`, onChangeForm);
    this._pointEdit.resetButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._closeNewPoint();
    });

    this._pointEdit.element.addEventListener(`submit`, onSubmit);

    document.addEventListener(`keydown`, onEscKeyDown);

    render(this._container, this._pointEdit.element, Position.AFTERBEGIN);
  }

  _closeNewPoint() {
    unrender(this._pointEdit.element);
    this._pointEdit.removeElement();
    this._removePointNew();
  }
}

export {NewPointController as default};
