import AbstractComponent from "./abstract-component";

class Offers extends AbstractComponent {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  get template() {
    return `<section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                  ${this._offers.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" 
                      ${offer.accepted ? `checked` : ``}>
                      <label class="event__offer-label" for="event-offer-${offer.title}-1">
                        <span class="event__offer-title">${offer.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                      </label>
                    </div>`).join(``)}
                  </div>
                </section>`;
  }

  get OffersOfSelectedType() {
    const priceElementsOfOffers = this.element.querySelectorAll(`.event__offer-price`);
    return Array.from(this.element.querySelectorAll(`.event__offer-checkbox`)).map((input, index) => ({
      title: input.name.slice(12),
      price: Number(priceElementsOfOffers[index].textContent),
      accepted: Boolean(input.checked)
    }));
  }


}

export {Offers as default};


