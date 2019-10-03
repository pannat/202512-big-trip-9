import {Position, render} from "./utils";
import Menu from "./components/menu";
import StatsController from "./controllers/stats";
import TripController from "./controllers/trip";
import API from "./api";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
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
let availableDestinations = [];
let availableOffers = [];

const onDataChange = (actionType, data, onError) => {
  switch (actionType) {
    case Action.DELETE:
      api.deletePoints({
        id: data.id
      })
        .catch((err) => {
          onError();
          throw err;
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
        .catch((err) => {
          onError();
          throw err;
        })
        .then(() => api.getPoints())
        .then((points) => {
          tripController.update(points);
          statsController.updateCharts(points);
        });
      break;
    case Action.CREATE:
      api.createPoints({data: data.toRAW()})
        .catch((err) => {
          onError();
          throw err;
        })
        .then(() => api.getPoints())
        .then((points) => {
          tripController.update(points);
          statsController.updateCharts(points);
        });
  }
};

const api = new API(END_POINT, AUTHORIZATION);

const tripController = new TripController(siteTripEventsElement, siteTotalCostElement, siteTripInfoElement, siteTripControlsElement, onDataChange);
const statsController = new StatsController(sitePageMainContainerElement);

api.getDestinations()
  .then((destinations) => {
    availableDestinations = destinations;
  })
  .then(() => api.getOffers()
    .then((offers) => {
      availableOffers = offers;
    }))
  .then(() => api.getPoints()
    .then((points) => {
      tripController.init(points);
      statsController.init(points);
    }));

const menu = new Menu();
render(siteTripControlsElement, menu.element, Position.AFTERBEGIN);

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

menu.element.addEventListener(`click`, (evt) => onMenuClick(evt));

siteButtonNewPointElement.addEventListener(`click`, () => {
  tripController.createNewPoint();
  tripController.show();
  statsController.hide();
  menu.setActiveButtonTable();
});

export {Action, availableDestinations, availableOffers};

