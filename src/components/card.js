export const createCardTemplate = ({type, city, date, time, price, options}) => `<li class="trip-events__item">
            <div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type[Object.keys(type)[0]]}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type[Object.keys(type)[0]]} ${prepositionMap[Object.keys(type)[0]]} ${city}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  ${Object.keys(time).map((it) => `<time class="event__${it}-time"
                    datetime="${new Date(date).toISOString().slice(0, 11)}${time[it]}">${time[it]}</time>`).join(` &mdash; `)}
                </p>
                <p class="event__duration">${calculateDuration(date, time)}M</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                  ${options.filter((option) => option.isApplied).map((option) => `<li class="event__offer">
                    <span class="event__offer-title">${option.title}</span>
                    +
                    &euro;
                    <span class="event__offer-price">${option.price}</span>
                </li>`).join(``)}
              </ul>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`.trim();

const calculateDuration = (date, time) => {
  let start = new Date(`${new Date(date).toDateString()} ${time.start}`);
  let end = new Date(`${new Date(date).toDateString()} ${time.end}`);
  return (end - start) / 1000 / 60;
};

export const prepositionMap = {
  transfer: `to`,
  activity: `in`,
  start: `From`,
  end: `To`
};
