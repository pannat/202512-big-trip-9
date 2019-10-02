import moment from "moment";

export default class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data.type ? `${data[`type`][0].toUpperCase()}${data[`type`].slice(1)}` : ``;
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.dates = {
      start: new Date(data[`date_from`]),
      end: new Date(data[`date_to`])
    };
    this.duration = moment(this.dates.end).diff(moment(this.dates.start));
    this.offers = Array.from(data[`offers`]);
    this.price = Number(data[`base_price`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      [`id`]: this.id,
      [`type`]: this.type ? this.type.toLowerCase() : ``,
      [`destination`]: {
        [`name`]: this.city,
        [`description`]: this.description,
        [`pictures`]: this.pictures,
      },
      [`date_from`]: this.dates.start,
      [`date_to`]: this.dates.end,
      [`offers`]: this.offers,
      [`base_price`]: this.price,
      [`is_favorite`]: this.isFavorite,
    };
  }
}
