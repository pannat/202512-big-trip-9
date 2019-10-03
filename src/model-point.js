import moment from "moment";
import dompurify from "dompurify";

export default class ModelPoint {
  constructor(data) {
    this.id = dompurify.sanitize(data[`id`]);
    this.type = `${dompurify.sanitize(data[`type`][0].toUpperCase())}${dompurify.sanitize(data[`type`]).slice(1)}`;
    this.city = dompurify.sanitize(data[`destination`][`name`]);
    this.description = dompurify.sanitize(data[`destination`][`description`]);
    this.pictures = data[`destination`][`pictures`];
    this.dates = {
      start: new Date(data[`date_from`]),
      end: new Date(data[`date_to`])
    };
    this.duration = moment(this.dates.end).diff(moment(this.dates.start));
    this.offers = Array.from(data[`offers`]);
    this.price = Number(dompurify.sanitize(data[`base_price`]));
    this.isFavorite = Boolean(dompurify.sanitize(data[`is_favorite`]));
  }

  update(changedData) {
    Object.assign(this, changedData);
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

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
