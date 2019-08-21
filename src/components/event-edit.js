import {cities} from "../site-data";
import {prepositionMap} from "./card";

const EventType = {
  transfer:
    [
      `Taxi`,
      `Bus`,
      `Train`,
      `Ship`,
      `Transport`,
      `Drive`,
      `Flight`,
    ],
  activity:
    [
      `Check-in`,
      `Sightseeing`,
      `Restaurant`
    ]
};


const offers = [
  {
    title: `Add luggage`,
    price: 10,
  },
  {
    title: `Switch to comfort class`,
    price: 150,
  },
  {
    title: `Add meal`,
    price: 2,
  },
  {
    title: `Choose seats`,
    price: 9,
  }
];

const calculatePrice = (price, options) => {
  let costs = options.filter((option) => option.isApplied).map((it) => it.price);
  for (let cost of costs) {
    price += cost;
  }
  return price;
};

export const createEventEditTemplate = ({type, city, photos, description, date, time, price, options}) => `<li class="trip-events__item">
            <form class="event  event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type[Object.keys(type)[0]].toLowerCase()}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  <div class="event__type-list">
                  ${Object.keys(EventType).map((group) => `<fieldset class="event__type-group">
                      <legend class="visually-hidden">${group}</legend>
                      ${EventType[group].map((event) => `
                      <div class="event__type-item">
                        <input id="event-type-${event}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event}" 
                        ${event === type[Object.keys(type)[0]] ? `checked` : ``} >
                        <label class="event__type-label  event__type-label--${event.toLowerCase()}" for="event-type-${event.toLowerCase()}-1">${event}</label>
                      </div>
                    `).join(``)}
                     </fieldset>
                   `).join(``)}
                  </div>
                </div>
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                     ${type[Object.keys(type)[0]]} ${prepositionMap[Object.keys(type)[0]]} 
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${cities.map((it) => `<option value="${it}"></option>`).join(``)}
                  </datalist>
                </div>
                <div class="event__field-group  event__field-group--time">
                  ${Object.keys(time).map((it) => `<label class="visually-hidden" for="event-start-${it}-1">${prepositionMap[it]}</label>
                  <input class="event__input  event__input--time" id="event-${it}-time-1" type="text" name="event-${it}-time"
                  value="${new Date(date).getDate()}/0${new Date(date).getMonth() + 1}/${String(new Date(date).getFullYear()).slice(2)} ${time[it]}">
                  `).join(` &mdash; `)}
                  
                </div>
                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" 
                  value="${calculatePrice(price, options)}">
                </div>
                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
                <label class="event__favorite-btn" for="event-favorite-1">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </label>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                  ${offers.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" 
                      ${options.filter((option) => option.isApplied).map((option) => option.title === offer.title ? `checked` : ``)}>
                      <label class="event__offer-label" for="event-offer-${offer.title}-1">
                        <span class="event__offer-title">${offer.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                      </label>
                    </div>`).join(``)}
                  </div>
                </section>
                <section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${description}</p>

                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${Array.from(photos).map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
                    </div>
                  </div>
                </section>
              </section>
            </form>
          </li>`.trim();
