import ModelPoint from "./model-point";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(API.toJSON)
      .then(ModelPoint.parsePoints);
  }

  deletePoints({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  updatePoints({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    });
  }

  createPoints({data}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    });
  }


  getDestinations() {
    return this._load({url: `destinations`})
      .then(API.toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(API.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus)
      .catch((err) => {
        API.onError(err);
        throw err;
      });
  }

  static onError(error) {
    const node = document.createElement(`div`);
    node.style = `width: 180px; margin: 0 auto; text-align: center; background-color: red;`;

    node.textContent = error;
    document.body.insertAdjacentElement(`afterbegin`, node);
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

export {API as default};
