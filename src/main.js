import {getPointMock, filterItems} from "./site-data";
import {Position, render} from "./utils";
import Rout from "./components/rout";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Stats from "./components/stats";
import TripController from "./controllers/trip";


const COUNT_POINTS = 4;

const tripMain = document.querySelector(`.trip-main`);
const siteTripInfoElement = tripMain.querySelector(`.trip-info`);
const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);
const siteTripControlsElement = tripMain.querySelector(`.trip-controls`);
const siteButtonNewPointElement = tripMain.querySelector(`.trip-main__event-add-btn`);
const sitePageMainContainerElement = document.querySelector(`.page-main .page-body__container`);
const siteTripEventsElement = sitePageMainContainerElement.querySelector(`.trip-events`);

const setTotalCost = (points) => {
  let cost = 0;
  for (let point of points) {
    cost += point.price;
    point.options.filter((option) => option.isApplied).forEach((option) => {
      cost += option.price;
    });
  }
  siteTotalCostElement.textContent = cost;
};

const pointMocks = new Array(COUNT_POINTS).fill(``).map(() => getPointMock());
const rout = new Rout(pointMocks);
const menu = new Menu();
const menuItemTable = menu.getElement().querySelector(`[data-menu-item = Table]`);
const menuItemStats = menu.getElement().querySelector(`[data-menu-item = Stats]`);
const filters = new Filter(filterItems);
const stats = new Stats();
const tripController = new TripController(siteTripEventsElement, pointMocks, setTotalCost);

render(siteTripInfoElement, rout.getElement(), Position.AFTERBEGIN);
render(siteTripControlsElement, menu.getElement(), Position.AFTERBEGIN);
render(siteTripControlsElement, filters.getElement(), Position.BEFOREEND);
tripController.init();
render(sitePageMainContainerElement, stats.getElement(), Position.BEFOREEND);

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `A`) {
    return;
  }

  switch (evt.target) {
    case menuItemTable:
      tripController.show();
      stats.getElement().classList.add(`visually-hidden`);
      filters.getElement().classList.remove(`visually-hidden`);
      menuItemTable.classList.add(`trip-tabs__btn--active`);
      menuItemStats.classList.remove(`trip-tabs__btn--active`);
      break;
    case menuItemStats:
      tripController.hide();
      stats.getElement().classList.remove(`visually-hidden`);
      filters.getElement().classList.add(`visually-hidden`);
      menuItemTable.classList.remove(`trip-tabs__btn--active`);
      menuItemStats.classList.add(`trip-tabs__btn--active`);
      break;
  }
});

siteButtonNewPointElement.addEventListener(`click`, () => {
  tripController.createNewPoint();
});
