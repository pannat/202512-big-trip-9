import {createRoutTemplate} from "./components/rout";
import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createSortingTemplate} from "./components/sorting";
import {createListEventsTemplate} from "./components/list-events";
import {getWaypoint, navItems, filters} from "./site-data";

const COUNT_WAYPOINTS = 4;
const waypoints = new Array(COUNT_WAYPOINTS).fill(``).map(() => getWaypoint());
const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, `afterbegin`, createRoutTemplate(waypoints));

const siteTripControlsElement = document.querySelector(`.trip-controls`);
render(siteTripControlsElement, `afterbegin`, createMenuTemplate(navItems));
render(siteTripControlsElement, `beforeend`, createFilterTemplate(filters));

const siteTripEventsElement = document.querySelector(`.trip-events`);
render(siteTripEventsElement, `beforeend`, createSortingTemplate());
render(siteTripEventsElement, `beforeend`, createListEventsTemplate(waypoints));

const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);
const getTotalCost = (cards, element) => {
  let cost = 0;
  for (let card of cards) {
    cost += card.price;
    card.options.filter((option) => option.isApplied).forEach((option) => {
      cost += option.price;
    });
  }
  element.textContent = cost;
};

getTotalCost(waypoints, siteTotalCostElement);
