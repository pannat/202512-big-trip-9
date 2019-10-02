import {Position, render} from "./utils";
import Menu from "./components/menu";
import StatsController from "./controllers/stats";
import TripController from "./controllers/trip";
import API from "./api";
import AbstractPointController from "./controllers/abstract-point";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=0.22904022242917632}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

const Action = {
  DELETE: `delete`,
  UPDATE: `update`,
  CREATE: `create`
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripInfoElement = siteTripMainElement.querySelector(`.trip-info`);
const siteTotalCostElement = siteTripInfoElement.querySelector(`.trip-info__cost-value`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteButtonNewPointElement = siteTripMainElement.querySelector(`.trip-main__event-add-btn`);
const sitePageMainContainerElement = document.querySelector(`.page-main .page-body__container`);
const siteTripEventsElement = sitePageMainContainerElement.querySelector(`.trip-events`);

const api = new API(END_POINT, AUTHORIZATION);

const onDataChange = (actionType, data) => {
  switch (actionType) {
    case Action.DELETE:
      api.deletePoints({
        id: data.id
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripController.update(points);
          statsController.updateCharts(points);
        });
      break;
    case Action.UPDATE:
      api.updatePoints({
        id: data.id,
        data: data.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripController.update(points);
          statsController.updateCharts(points);
        });
      break;
    case Action.CREATE:
      api.createPoints({data: data.toRAW()})
        .then(() => api.getPoints())
        .then((points) => {
          tripController.update(points);
          statsController.updateCharts(points);
        });
  }
};

const tripController = new TripController(siteTripEventsElement, siteTotalCostElement, siteTripInfoElement, siteTripControlsElement, onDataChange);
const statsController = new StatsController(sitePageMainContainerElement);

api.getDestinations()
  .then((destinations) => AbstractPointController.setDestinations(destinations))
  .then(() => api.getOffers()
    .then((offers) => AbstractPointController.setOffers(offers)))
  .then(() => api.getPoints()
    .then((points) => {
      tripController.init(points);
      statsController.init(points);
    }));

const menu = new Menu();
render(siteTripControlsElement, menu.getElement(), Position.AFTERBEGIN);

const onMenuClick = (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `A`) {
    return;
  }

  switch (evt.target.dataset.menuItem) {
    case MenuItem.TABLE:
      tripController.show();
      statsController.hide();
      menu.setActiveButtonTable();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statsController.show();
      menu.setActiveButtonStats();
      break;
  }
};

menu.getElement().addEventListener(`click`, (evt) => onMenuClick(evt));

siteButtonNewPointElement.addEventListener(`click`, () => {
  tripController.createNewPoint();
  tripController.show();
  statsController.hide();
  menu.setActiveButtonTable();
});

export {Action};
