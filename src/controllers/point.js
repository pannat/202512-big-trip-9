import {Key, Position, render} from "../utils";
import Point from "../components/point";
import PointEdit from "../components/point-edit";
import {pointTypes} from "../components/point-edit";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";


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
    flatpickr(this._pointEdit.getElement().querySelector(`input[name=event-start-time]`), {
      altInput: true,
      altFormat: `d.m.y H:m`,
      enableTime: true,
      dateFormat: `Y-m-d H:m`,
      defaultDate: this._data.dates.start,
      minDate: this._data.dates.start,
      onChange(selectedDates) {
        calendarEnd.config.minDate = new Date(selectedDates);
      }
    });

    const calendarEnd = flatpickr(this._pointEdit.getElement().querySelector(`input[name=event-end-time]`), {
      altInput: true,
      altFormat: `d.m.y H:m`,
      enableTime: true,
      dateFormat: `Y-m-d H:m`,
      defaultDate: this._data.dates.end,
      minDate: this._data.dates.start,
    });

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
        isApplied: !!formData.get(input.name)
      }));
    };

    return {
      type: getType(formData.get(`event-type`)),
      city: formData.get(`event-destination`),
      dates: {
        start: Date.parse(formData.get(`event-start-time`)),
        end: Date.parse(formData.get(`event-end-time`)),
      },
      photos: getSrcPhotos(),
      price: formData.get(`event-price`),
      description: this._pointEdit.getElement().querySelector(`.event__destination-description`).textContent,
      options: getOptions()
    };
  }
}
