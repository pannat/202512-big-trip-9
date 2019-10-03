import {availableDestinations, availableOffers} from "../main";
import OffersComponent from "../components/offers";
import DestinationComponent from "../components/destination";
import {render, unrender, Position, InputName} from "../utils";

class AbstractPointController {
  constructor(container, data, onDataChange, onChangeView, Point) {
    this._container = container;
    this._data = data;
    this._cities = availableDestinations.map(({name}) => name);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointEdit = new Point(data, this._cities);
    this._offersComponent = new OffersComponent(data.offers);
    this._destinationComponent = new DestinationComponent(data);

    if (new.target === AbstractPointController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  _updateOffersForCurrentType(currentValue) {
    const offersForCurrentType = availableOffers.find((offer) => offer.type === currentValue.toLowerCase()).offers;
    unrender(this._offersComponent.element);
    this._offersComponent.removeElement();
    if (offersForCurrentType.length) {
      this._createOffers(offersForCurrentType);
    }
  }

  _updateDestinationForCurrentCity(currentValue) {
    const destinationInfoForCurrentCity = availableDestinations.find((destination) => destination.name === currentValue);
    unrender(this._destinationComponent.element);
    this._destinationComponent.removeElement();
    if (destinationInfoForCurrentCity) {
      this._createDestination(destinationInfoForCurrentCity);
    }
  }

  _createOffers(data) {
    this._offersComponent = new OffersComponent(data);
    render(this._pointEdit.containerEventDetails, this._offersComponent.element, Position.AFTERBEGIN);
  }

  _createDestination(destination) {
    this._destinationComponent = new DestinationComponent(destination);
    render(this._pointEdit.containerEventDetails, this._destinationComponent.element, Position.BEFOREEND);
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
      pictures: this._destinationComponent.calculatePicturesOfSelectedDestination(),
      price: Number(formData.get(InputName.PRICE)),
      description: this._destinationComponent.calculateDescriptionOfSelectedDestination(),
      offers: this._offersComponent.calculateOffersOfSelectedType(),
      isFavorite: Boolean(formData.get(InputName.FAVORITE))
    };
  }

  _onError() {
    this._pointEdit.disableForm(false);
    this._pointEdit.shake();
    this._pointEdit.highlight();
    setTimeout(() => {
      this._pointEdit.removeAnimation();
    }, 1000);
  }
}

export {AbstractPointController as default};

