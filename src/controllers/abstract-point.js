import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import OffersComponent from "../components/offers";
import DestinationComponent from "../components/destination";
import {getPreposition, render, unrender, Position} from "../utils";

const Input = {
  TYPE: `event-type`,
  DESTINATION: `event-destination`
};

class AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, Point) {
    this._container = container;
    this._data = data;
    this._cities = AbstractPointController.destinations.map(({name}) => name);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointEdit = new Point(data, this._cities);
    this._offersComponent = new OffersComponent(data.offers);
    this._destinationComponent = new DestinationComponent(data);
    this._containerEventDetails = this._pointEdit.getElement().querySelector(`.event__details`);

    if (new.target === AbstractPointController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._init();
  }

  _init() {
    this._pointEdit.getElement().addEventListener(`change`, (evt) => this._onChangeForm(evt));
  }

  _initializeCalendars() {
    flatpickr(this._pointEdit.getElement().querySelector(`input[name=event-start-time]`), {
      altInput: true,
      altFormat: `d.m.Y H:i`,
      [`time_24hr`]: true,
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
      [`time_24hr`]: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      defaultDate: this._data.dates.end,
      minDate: this._data.dates.start,
    });
  }

  _createNewData() {
    const formData = new FormData(this._pointEdit.getElement());
    const priceElementsOfOffers = this._pointEdit.getElement().querySelectorAll(`.event__offer-price`);
    return {
      type: formData.get(`event-type`).toLowerCase(),
      city: formData.get(`event-destination`),
      dates: {
        start: Date.parse(formData.get(`event-start-time`)),
        end: Date.parse(formData.get(`event-end-time`)),
      },
      pictures: Array.from(this._pointEdit.getElement().querySelectorAll(`.event__photo`)).map((photo) => (
        {
          src: photo.src,
          description: photo.alt
        })
      ),
      price: Number(formData.get(`event-price`)),
      description: this._pointEdit.getElement().querySelector(`.event__destination-description`) ? this._pointEdit.getElement().querySelector(`.event__destination-description`).textContent : ``,
      offers: Array.from(this._pointEdit.getElement().querySelectorAll(`.event__offer-checkbox`)).map((input, index) => ({
        title: input.name.slice(12),
        price: Number(priceElementsOfOffers[index].textContent),
        accepted: Boolean(formData.get(input.name))
      })),
      isFavorite: Boolean(formData.get(`event-favorite`))
    };
  }

  _updateOffersForCurrentType(offers) {
    unrender(this._offersComponent.getElement());
    this._offersComponent.removeElement();
    if (offers.length) {
      this._createOffers(offers);
    }
  }

  _updateDestinationForCurrentCity(destination) {
    unrender(this._destinationComponent.getElement());
    this._destinationComponent.removeElement();
    if (destination) {
      this._createDestination(destination);
    }
  }

  _createOffers(data) {
    this._offersComponent = new OffersComponent(data);
    render(this._containerEventDetails, this._offersComponent.getElement(), Position.AFTERBEGIN);
  }

  _createDestination(destination) {
    this._destinationComponent = new DestinationComponent(destination);
    render(this._containerEventDetails, this._destinationComponent.getElement(), Position.BEFOREEND);
  }

  _changePointType(type) {
    this._pointEdit.getElement()
      .querySelector(`.event__type-output`)
      .textContent = `${type} ${getPreposition(type)}`;

    this._pointEdit.getElement()
      .querySelector(`.event__type-icon`)
      .src = `img/icons/${type.toLowerCase()}.png`;
  }

  _onChangeForm(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    switch (evt.target.name) {
      case Input.TYPE:
        this._pointEdit.getElement()
          .querySelector(`.event__type-toggle`)
          .checked = false;
        const currentType = evt.target.value;
        this._changePointType(currentType);
        const offersForCurrentType = AbstractPointController.offers.find((offer) => offer.type === currentType.toLowerCase()).offers;
        this._updateOffersForCurrentType(offersForCurrentType);
        break;

      case Input.DESTINATION:
        const destinationInfoForCurrentCity = AbstractPointController.destinations.find((destination) => destination.name === evt.target.value);
        this._updateDestinationForCurrentCity(destinationInfoForCurrentCity);
        break;
    }

    if (this._containerEventDetails.hasChildNodes()) {
      this._containerEventDetails.classList.remove(`visually-hidden`);
    } else {
      this._containerEventDetails.classList.add(`visually-hidden`);
    }
  }

  static setDestinations(destinations) {
    AbstractPointController.destinations = destinations;
  }

  static setOffers(offers) {
    AbstractPointController.offers = offers;
  }
}

export {AbstractPointController as default};

