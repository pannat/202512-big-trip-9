import {createRoutTemplate} from "./components/rout";
import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createSortingTemplate} from "./components/sorting";
import {createListEventsTemplate} from "./components/list-events";
import {createEventEditTemplate} from "./components/event-edit";
import {createCardTemplate} from "./components/card";

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, `afterbegin`, createRoutTemplate());

const siteTripControlsElement = document.querySelector(`.trip-controls`);
render(siteTripControlsElement, `afterbegin`, createMenuTemplate());
render(siteTripControlsElement, `beforeend`, createFilterTemplate());

const siteTripEventsElement = document.querySelector(`.trip-events`);
render(siteTripEventsElement, `beforeend`, createSortingTemplate());
render(siteTripEventsElement, `beforeend`, createListEventsTemplate());

const siteTripEventsListElement = document.querySelector(`.trip-events__list`);
render(siteTripEventsListElement, `beforeend`, createEventEditTemplate());
new Array(3).fill(``).forEach(() => render(siteTripEventsListElement, `beforeend`, createCardTemplate()));
