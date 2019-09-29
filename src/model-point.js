import moment from "moment";

export default class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = `${data[`type`][0].toUpperCase()}${data[`type`].slice(1)}`;
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.photos = data[`destination`][`pictures`];
    this.dates = {
      start: Date.parse(new Date(data[`date_from`])),
      end: Date.parse(new Date(data[`date_to`]))
    };
    this.duration = moment(this.dates.end).diff(moment(this.dates.start));
    this.options = data[`offers`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
