import AbstractComponent from "./abstract-component";
import {groupToType} from "../utils";

export default class AbstractPoint extends AbstractComponent {
  constructor({type, city, dates, price, options, description, photos, isFavorite}, destinationCities = []) {
    super();
    this._choosenType = type ? type : ``;
    this._preposition = ``;
    this._city = city;
    this._dates = dates;
    this._price = price;
    this._options = options;
    this._description = description;
    this._photos = photos;
    this._isFavorite = isFavorite;
    this._destinationCities = destinationCities;

    this._groupToType = groupToType;
    this._groupToPreposition = {
      transfer: `to`,
      activity: `in`
    };

    this._stageToPreposition = {
      start: `From`,
      end: `To`
    };

    this._setPreposition();

    if (new.target === AbstractPoint) {
      throw new Error(`Can't instantiate AbstractPoint, only concrete one.`);
    }
  }

  _setPreposition() {
    for (let group in this._groupToType) {
      if (this._groupToType[group].includes(this._choosenType)) {
        this._preposition = this._groupToPreposition[group];
        break;
      }
    }
  }
}
