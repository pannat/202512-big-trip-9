import AbstractComponent from "./abstract-component";

export default class extends AbstractComponent {
  constructor({description, pictures}) {
    super();
    this._description = description;
    this._photos = pictures;
  }

  getTemplate() {
    return `<section class="event__section  event__section--destination ${this._description ? `` : `visually-hidden`}">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${this._description}</p>

                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${this._photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
                    </div>
                  </div>
                </section>`;
  }
}
