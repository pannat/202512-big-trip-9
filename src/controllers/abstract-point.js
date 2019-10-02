import OffersComponent from "../components/offers";
import DestinationComponent from "../components/destination";
import {render, unrender, Position, InputName} from "../utils";

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


    if (new.target === AbstractPointController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._init();
  }

  _init() {
    const onChangeForm = (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      switch (evt.target.name) {
        case InputName.TYPE:
          const currentType = evt.target.value;
          this._pointEdit.setSelectedType(currentType);
          this._updateOffersForCurrentType(evt.target.value);
          this._pointEdit.setClassForContainerEventDetails();
          break;

        case InputName.DESTINATION:
          this._updateDestinationForCurrentCity(evt.target.value);
          this._pointEdit.setClassForContainerEventDetails();
          break;
      }
    };

    this._pointEdit.element.addEventListener(`change`, onChangeForm);
  }

  _updateOffersForCurrentType(currentValue) {
    const offersForCurrentType = AbstractPointController.offers.find((offer) => offer.type === currentValue.toLowerCase()).offers;
    unrender(this._offersComponent.element);
    this._offersComponent.removeElement();
    if (offersForCurrentType.length) {
      this._createOffers(offersForCurrentType);
    }
  }

  _updateDestinationForCurrentCity(currentValue) {
    const destinationInfoForCurrentCity = AbstractPointController.destinations.find((destination) => destination.name === currentValue);
    unrender(this._destinationComponent.element);
    this._destinationComponent.removeElement();
    if (destinationInfoForCurrentCity) {
      this._createDestination(destinationInfoForCurrentCity);
    }
  }

  _createOffers(data) {
    this._offersComponent = new OffersComponent(data);
    render(this._pointEdit.ContainerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
  }

  _createDestination(destination) {
    this._destinationComponent = new DestinationComponent(destination);
    render(this._pointEdit.ContainerEventDetails, this._destinationComponent.element, Position.BEFOREEND);
  }

  _createNewData() {
    const formData = new FormData(this._pointEdit.element);
    return {
      type: formData.get(InputName.TYPE),
      city: formData.get(InputName.DESTINATION),
      dates: {
        start: Date.parse(formData.get(InputName.START_TIME)),
        end: Date.parse(formData.get(InputName.END_TIME)),
      },
      pictures: this._destinationComponent.PicturesOfSelectedDestination,
      price: Number(formData.get(InputName.PRICE)),
      description: this._destinationComponent.DescriptionOfSelectedDestination,
      offers: this._offersComponent.OffersOfSelectedType,
      isFavorite: Boolean(formData.get(InputName.FAVORITE))
    };
  }

  static setDestinations(destinations) {
    AbstractPointController.destinations = destinations;
  }

  static setOffers(offers) {
    AbstractPointController.offers = offers;
  }
}

export {AbstractPointController as default};

