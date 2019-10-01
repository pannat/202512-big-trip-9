import {Position, render} from "./utils";
import Menu from "./components/menu";
import Stats from "./components/stats";
import TripController from "./controllers/trip";
import API from "./api";
import AbstractPointController from "./controllers/abstract-point";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=0.22904022242917632}`;
console.log(AUTHORIZATION);
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripInfoElement = siteTripMainElement.querySelector(`.trip-info`);
const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteButtonNewPointElement = siteTripMainElement.querySelector(`.trip-main__event-add-btn`);
const sitePageMainContainerElement = document.querySelector(`.page-main .page-body__container`);
const siteTripEventsElement = sitePageMainContainerElement.querySelector(`.trip-events`);

const api = new API(END_POINT, AUTHORIZATION);

const onDataChange = (actionType, update) => {
  switch (actionType) {
    case `delete`:
      api.deletePoints({
        id: update.id
      })
        .then(() => api.getPoints())
        .then((points) => tripController.update(points));
      break;
    case `update`:
      api.updatePoints({
        id: update.id,
        data: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => tripController.update(points));
      break;
  }
};

const tripController = new TripController(siteTripEventsElement, siteTotalCostElement, siteTripInfoElement, siteTripControlsElement, onDataChange);

api.getDestinations()
  .then((destinations) => AbstractPointController.setDestinations(destinations))
  .then(() => api.getOffers()
    .then((offers) => AbstractPointController.setOffers(offers)))
  .then(() => api.getPoints()
    .then((points) => tripController.init(points)));

const menu = new Menu();
const stats = new Stats();
const menuItemTable = menu.getElement().querySelector(`[data-menu-item = Table]`);
const menuItemStats = menu.getElement().querySelector(`[data-menu-item = Stats]`);

render(siteTripControlsElement, menu.getElement(), Position.AFTERBEGIN);
render(sitePageMainContainerElement, stats.getElement(), Position.BEFOREEND);

const onMenuClick = (evt) => {
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
};

menu.getElement().addEventListener(`click`, (evt) => onMenuClick(evt));

siteButtonNewPointElement.addEventListener(`click`, () => tripController.createNewPoint());
