import {Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import {Action} from "../main";


class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._pointView = new Point(data);
    this._pointEdit = new PointEdit(data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._init();
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.element)) {
      this._pointEdit.onClose();
    }
  }

  _init() {
    this._pointEdit.close = () => {
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    };

    this._pointEdit.open = () => {
      this._onChangeView();
      this._container.replaceChild(this._pointEdit.element, this._pointView.element);
    };

    this._pointEdit.onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        if (this._container.contains(this._pointEdit.element)) {
          this._pointEdit.onClose();
        }
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
      this._pointEdit.onOpen();
    });

    // this._pointEdit.resetButton.addEventListener(`click`, onDeleteButtonClick);

    render(this._container, this._pointView.element, Position.AFTERBEGIN);
  }
}

export {PointController as default};
