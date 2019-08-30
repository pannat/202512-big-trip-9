import {getEventMock, navItems, filterItems} from "./site-data";
import {Position, render} from "./utils";
import Rout from "./components/rout";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Sorting from "./components/sorting";
import TripController from "./controllers/trip";


const COUNT_POINTS = 4;

const siteTripInfoElement = document.querySelector(`.trip-info`);
const siteTripControlsElement = document.querySelector(`.trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);
const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);

const renderRout = (mocks) => {
  const rout = new Rout(mocks);
  render(siteTripInfoElement, rout.getElement(), Position.AFTERBEGIN);
};

const renderMenu = (navItemsData) => {
  const menu = new Menu(navItemsData);
  render(siteTripControlsElement, menu.getElement(), Position.AFTERBEGIN);
};

const renderFilters = (filtersData) => {
  const filters = new Filter(filtersData);
  render(siteTripControlsElement, filters.getElement(), Position.BEFOREEND);
};

const renderSorting = () => {
  const sorting = new Sorting();
  render(siteTripEventsElement, sorting.getElement(), Position.BEFOREEND);
};

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

const eventMocks = new Array(COUNT_POINTS).fill(``).map(() => getEventMock()).sort((a, b) => a.dueDate - b.dueDate);
renderRout(eventMocks);
renderMenu(navItems);
renderFilters(filterItems);
renderSorting();
getTotalCost(eventMocks, siteTotalCostElement);

const tripController = new TripController(siteTripEventsElement, eventMocks);
tripController.init();
