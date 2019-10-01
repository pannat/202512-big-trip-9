import AbstractComponent from "./abstract-component";
import {groupToType, getPreposition} from "../utils";

class AbstractPoint extends AbstractComponent {
  constructor({type, city, dates, price, offers, description, pictures, isFavorite}, destinationCities = []) {
    super();
    this._choosenType = type ? type : ``;

    this._city = city;
    this._dates = dates;
    this._price = price;
    this._offers = offers;
    this._description = description;
    this._photos = pictures;
    this._isFavorite = isFavorite;
    this._destinationCities = destinationCities;
    this._groupToType = groupToType;
    this._preposition = getPreposition(type);
    this._stageToPreposition = {
      start: `From`,
      end: `To`
    };

    if (new.target === AbstractPoint) {
      throw new Error(`Can't instantiate AbstractPoint, only concrete one.`);
    }
  }
}

export {AbstractPoint as default};
