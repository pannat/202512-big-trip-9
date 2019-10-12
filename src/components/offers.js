import AbstractComponent from "./abstract-component";
import dompurify from "dompurify";

class Offers extends AbstractComponent {
  constructor(offers) {
    super();
    this._offers = offers;
    this._offerInputs = this.element.querySelectorAll(`.event__offer-checkbox`);
    this._priceElements = this.element.querySelectorAll(`.event__offer-price`);
  }

  get template() {
    return `<section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                  ${this._offers.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${dompurify.sanitize(offer.title)}-1"
                      type="checkbox" name="event-offer-${dompurify.sanitize(offer.title)}" 
                      ${offer.accepted ? `checked` : ``}>
                      <label class="event__offer-label" for="event-offer-${dompurify.sanitize(offer.title)}-1">
                        <span class="event__offer-title">${dompurify.sanitize(offer.title)}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${dompurify.sanitize(offer.price)}</span>
                      </label>
                    </div>`).join(``)}
                  </div>
                </section>`;
  }

  calculateOffersOfSelectedType() {
    return Array.from(this._offerInputs).map((input, index) => ({
      title: input.name.slice(12),
      price: Number(this._priceElements[index].textContent),
      accepted: Boolean(input.checked)
    }));
  }

}

export {Offers as default};


