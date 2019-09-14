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

export default class AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, Point) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointEdit = new Point(data);

    if (new.target === AbstractPointController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  create() {
    throw new Error(`Abstract method not implemented: create`);
  }

  _initializeCalendars() {
    flatpickr(this._pointEdit.getElement().querySelector(`input[name=event-start-time]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._data.dates.start,
      onChange(selectedDates) {
        calendarEnd.config.minDate = new Date(selectedDates);
      }
    });

    const calendarEnd = flatpickr(this._pointEdit.getElement().querySelector(`input[name=event-end-time]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._data.dates.end,
      minDate: this._data.dates.start,
    });
  }

  _createNewData() {
    let formData = new FormData(this._pointEdit.getElement());
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

    const getType = (pointType) => {
      const type = {};
      for (let group in pointTypes) {
        if (pointTypes[group].indexOf(pointType) >= 0) {
          type[group] = pointType;
        }
      }
      return type;
    };

    return {
      type: getType(formData.get(`event-type`)),
      city: formData.get(`event-destination`),
      dates: {
        start: Date.parse(formData.get(`event-start-time`)),
        end: Date.parse(formData.get(`event-end-time`)),
      },
      photos: getSrcPhotos(),
      price: Number(formData.get(`event-price`)),
      description: this._pointEdit.getElement().querySelector(`.event__destination-description`) ? this._pointEdit.getElement().querySelector(`.event__destination-description`).textContent : ``,
      options: getOptions()
    };
  }
}
