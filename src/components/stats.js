import AbstractComponent from "./abstract-component";

class Stats extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return `<section class="statistics visually-hidden">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
  }

  get moneyCtx() {
    this._moneyCtx = this.element.querySelector(`.statistics__chart--money`);
    return this._moneyCtx;
  }

  get transportCtx() {
    this._transportCtx = this.element.querySelector(`.statistics__chart--transport`);
    return this._transportCtx;
  }

  get timeCtx() {
    this._timeCtx = this.element.querySelector(`.statistics__chart--time`);
    return this._timeCtx;
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }
}

export {Stats as default};
