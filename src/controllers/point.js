import {Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import {pointTypes} from "../components/point-edit";

const offersPriceMap = {
  [`Add luggage`]: 10,
  [`Switch to comfort`]: 150,
  [`Add meal`]: 2,
  [`Choose seats`]: 9
};

const getType = (pointType) => {
  const type = {};
  for (let group in pointTypes) {
    if (group.indexOf(pointType)) {
      type[group] = pointType;
    }
  }
  return type;
};


export default class {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._pointView = new Point(data);
    this._pointEdit = new PointEdit(data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.init();
  }

  init() {
    const openCardEdit = () => {
      this._onChangeView();
      this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
    };
    const closeCardEdit = () => {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        closeCardEdit();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
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
      this._onDataChange(this._createNewData(), this._data);
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    render(this._container, this._pointView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
    }
  }

  _createNewData() {
    const formData = new FormData(this._pointEdit.getElement());
    const getSrcPhotos = () => {
      const photos = new Set();
      this._pointEdit.getElement().querySelectorAll(`.event__photo`).forEach((photo) => photos.add(photo.src));
      return photos;
    };

    const getOptions = () => {
      const optionsInputs = this._pointEdit.getElement().querySelectorAll(`.event__offer-checkbox`);
      return Array.from(optionsInputs).map((input) => ({
        title: input.name.slice(12),
        price: offersPriceMap[input.name.slice(12)],
        isApplied: formData.get(input.name) ? true : false
      }));
    };

    return {
      type: getType(formData.get(`event-type`)),
      city: formData.get(`event-destination`),
      dueData: formData.get(`event-start-time`).split(` `)[0].split(`/`).join(`-`),
      time: {
        start: formData.get(`event-start-time`).split(` `)[1],
        end: formData.get(`event-end-time`).split(` `)[1],
      },
      photos: getSrcPhotos(),
      price: formData.get(`event-price`),
      description: this._pointEdit.getElement().querySelector(`.event__destination-description`).textContent,
      options: getOptions()
    };
  }
}
