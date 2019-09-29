import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import OffersComponent from "../components/offers";
import DestinationComponent from "../components/destination";
import {render, unrender, Position} from "../utils";

export default class AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, Point) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointEdit = new Point(data, AbstractPointController.destinations.map(({name}) => name));
    this._offersComponent = new OffersComponent(data.options);
    this._DestinationComponent = new DestinationComponent(data.description, data.photos);
    this._containerEventDetails = this._pointEdit.getElement().querySelector(`.event__details`);

    if (new.target === AbstractPointController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._init();
  }

  _init() {
    render(this._containerEventDetails, this._offersComponent.getElement(), Position.AFTERBEGIN);
    render(this._containerEventDetails, this._DestinationComponent.getElement(), Position.BEFOREEND);

    this._pointEdit.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {

        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        this._pointEdit.getElement()
          .querySelector(`.event__type-output`)
          .innerHTML = `${evt.target.value} `;

        this._pointEdit.getElement()
          .querySelector(`.event__type-toggle`)
          .checked = false;

        unrender(this._offersComponent.getElement());
        this._offersComponent.removeElement();
        const offersForCurrentType = AbstractPointController.offers.find((offer) => offer.type === evt.target.value.toLowerCase()).offers;
        this._createOffers(offersForCurrentType);
      });

    this._pointEdit.getElement().
      querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {

        unrender(this._DestinationComponent.getElement());
        this._DestinationComponent.removeElement();
        const infoForCurrentDestination = AbstractPointController.destinations.find((destination) => destination.name === evt.target.value);
        this._createDestination(infoForCurrentDestination.description, infoForCurrentDestination.pictures);
      });
  }

  _createOffers(data) {
    this._offersComponent = new OffersComponent(data);
    render(this._containerEventDetails, this._offersComponent.getElement(), Position.AFTERBEGIN);
  }

  _createDestination(description, photos) {
    this._DestinationComponent = new DestinationComponent(description, photos);
    render(this._containerEventDetails, this._DestinationComponent.getElement(), Position.BEFOREEND);
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
        price: input.name.slice(12),
        isApplied: !!formData.get(input.name)
      }));
    };
    return {
      type: formData.get(`event-type`).toLowerCase(),
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

  static setDestinations(destinations) {
    AbstractPointController.destinations = destinations;
  }

  static setOffers(offers) {
    AbstractPointController.offers = offers;
  }
}
