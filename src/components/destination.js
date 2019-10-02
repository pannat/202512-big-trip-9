import AbstractComponent from "./abstract-component";
import {InputName} from "../utils";

class Destination extends AbstractComponent {
  constructor({description, pictures}) {
    super();
    this._description = description;
    this._photos = pictures;
  }

  get template() {
    return `<section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${this._description}</p>

                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${this._photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
                    </div>
                  </div>
                </section>`;
  }

  get DescriptionOfSelectedDestination() {
    return this.element.querySelector(InputName.DESCRIPTION).textContent;
  }

  get PicturesOfSelectedDestination() {
    return Array.from(this.element.querySelectorAll(`.event__photo`)).map((photo) => (
      {
        src: photo.src,
        description: photo.alt
      }));
  }
}

export {Destination as default};

