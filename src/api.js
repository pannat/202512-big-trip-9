import ModelPoint from "./model-point";
import AbstractPointController from "./controllers/abstract-point";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(API.toJSON)
      .then(ModelPoint.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(API.toJSON)
      .then(AbstractPointController.setDestinations);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(API.toJSON)
      .then(AbstractPointController.setOffers);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static toJSON(response) {
    return response.json();
  }
}
