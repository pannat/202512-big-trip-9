import {getPointMock} from "./site-data";
import {Position, render} from "./utils";
import Menu from "./components/menu";
import Stats from "./components/stats";
import TripController from "./controllers/trip";


const COUNT_POINTS = 4;

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripInfoElement = siteTripMainElement.querySelector(`.trip-info`);
const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteButtonNewPointElement = siteTripMainElement.querySelector(`.trip-main__event-add-btn`);
const sitePageMainContainerElement = document.querySelector(`.page-main .page-body__container`);
const siteTripEventsElement = sitePageMainContainerElement.querySelector(`.trip-events`);

const pointMocks = new Array(COUNT_POINTS).fill(``).map(() => getPointMock());
const menu = new Menu();
const stats = new Stats();
const menuItemTable = menu.getElement().querySelector(`[data-menu-item = Table]`);
const menuItemStats = menu.getElement().querySelector(`[data-menu-item = Stats]`);

render(siteTripControlsElement, menu.getElement(), Position.AFTERBEGIN);
render(sitePageMainContainerElement, stats.getElement(), Position.BEFOREEND);
const tripController = new TripController(siteTripEventsElement, pointMocks, siteTotalCostElement, siteTripInfoElement, siteTripControlsElement);

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `A`) {
    return;
  }

  switch (evt.target) {
    case menuItemTable:
      tripController.show();
      stats.getElement().classList.add(`visually-hidden`);
      menuItemTable.classList.add(`trip-tabs__btn--active`);
      menuItemStats.classList.remove(`trip-tabs__btn--active`);
      break;
    case menuItemStats:
      tripController.hide();
      stats.getElement().classList.remove(`visually-hidden`);
      menuItemTable.classList.remove(`trip-tabs__btn--active`);
      menuItemStats.classList.add(`trip-tabs__btn--active`);
      break;
  }
});

siteButtonNewPointElement.addEventListener(`click`, () => {
  tripController.createNewPoint();
});
