import {Position, render} from "./components/utils";
import Rout from "./components/rout";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Sorting from "./components/sorting";
import ListEvents from "./components/list-events";
import Card from "./components/card";
import CardEdit from "./components/event-edit";
import {getPointMock, navItems, filterItems} from "./site-data";

const COUNT_POINTS = 4;
const ESC_KEYCODE = 27;

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

const renderCard = (mock, container) => {
  const card = new Card(mock);
  const cardEdit = new CardEdit(mock);
  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESC_KEYCODE) {
      container.replaceChild(card.getElement(), cardEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const openCardEdit = () => {
    container.replaceChild(cardEdit.getElement(), card.getElement());
  };
  const closeCardEdit = () => {
    container.replaceChild(card.getElement(), cardEdit.getElement());
  };

  card.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      openCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  cardEdit.getElement().
  querySelector(`.event__rollup-btn`).
  addEventListener(`click`, () => {
    closeCardEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  cardEdit.getElement().
  querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    closeCardEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(container, card.getElement(), Position.BEFOREEND);
};

const getUnicueDates = (mocks) => {
  let dates = new Set();
  mocks.sort((a, b) => a.dueDate - b.dueDate).map((mock) => dates.add(new Date(mock.dueDate).toDateString()));
  return Array.from(dates);
};

const renderListEvents = (mocks) => {
  const uniqueDates = getUnicueDates(mocks);
  const listEvents = new ListEvents(uniqueDates);
  const filteredByDateArraysMocks = uniqueDates.map((date) => mocks.filter((mock) => new Date(mock.dueDate).toDateString() === date));
  listEvents.getElement().
  querySelectorAll(`.trip-events__list`).forEach((container, index) => {
    filteredByDateArraysMocks[index].forEach((mock) => renderCard(mock, container));
  });
  render(siteTripEventsElement, listEvents.getElement(), Position.BEFOREEND);
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

const pointMocks = new Array(COUNT_POINTS).fill(``).map(() => getPointMock());
renderRout(pointMocks);
renderMenu(navItems);
renderFilters(filterItems);
renderSorting();
renderListEvents(pointMocks);
getTotalCost(pointMocks, siteTotalCostElement);

