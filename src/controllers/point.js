import {InputName, Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import AbstractPointController from "./abstract-point";
import {Action} from "../main";


class PointController extends AbstractPointController {
  constructor(container, data, onDataChange, onChangeView) {
    super(container, data, onDataChange, onChangeView, PointEdit);
    this._data = data;
    this._pointView = new Point(data);
    this._init();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.element)) {
      this._pointEdit.onClose();
    }
  }

  _init() {
    const openPointEdit = () => {
      this._onChangeView();
      this._pointEdit.bind();

      this._pointEdit.cancelChange(this._updateDestinationForCurrentCity.bind(this), this._updateOffersForCurrentType.bind(this));
      this._offersComponent.revertOffers();
      this._container.replaceChild(this._pointEdit.element, this._pointView.element);
    };

    this._pointEdit.close = () => {
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    };

    this._pointEdit.onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        if (this._container.contains(this._pointEdit.element)) {
          this._pointEdit.onClose();
        }
      }
    };

    this._pointEdit.onChangeForm = (evt) => {
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

    this._pointEdit.onSubmit = (evt) => {
      evt.preventDefault();
      this._data.update(this._createNewData());
      this._pointEdit.disableForm(true);
      this._pointEdit.changeTextSaveButton(`Saving`);
      this._onDataChange(Action.UPDATE, this._data, () => {
        this._onError();
        this._pointEdit.changeTextSaveButton(`Save`);
      });
      this._pointEdit.unbind();
    };

    // const onDeleteButtonClick = (evt) => {
    //   evt.preventDefault();
    //   this._pointEdit.disableForm(true);
    //   this._pointEdit.changeTextResetButton(`Deleting...`);
    //   this._onDataChange(Action.DELETE, this._data, () => {
    //     this._onError();
    //     this._pointEdit.changeTextResetButton(`Delete`);
    //   });
    //   document.removeEventListener(`keydown`, onEscKeyDown);
    // };

    // this._pointEdit.element.addEventListener(`change`, onChangeForm);

    this._pointView.rollupButton.addEventListener(`click`, () => {
      openPointEdit();
    });

    // this._pointEdit.rollupButton.addEventListener(`click`, () => {
    //   closePointEdit();
    // });
    // this._pointEdit.resetButton.addEventListener(`click`, onDeleteButtonClick);

    if (this._data.offers.length) {
      render(this._pointEdit.containerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
    }
    render(this._pointEdit.containerEventDetails, this._destinationComponent.element, Position.BEFOREEND);
    render(this._container, this._pointView.element, Position.AFTERBEGIN);

    // this._onEscKeyDown = onEscKeyDown;
  }
}

export {PointController as default};
