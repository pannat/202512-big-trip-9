import {Position, Key, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Day from "../components/day";
import CardEvent from "../components/card-event";
import CardEventEdit from "../components/card-event-edit";
import Sort from "../components/sort.js";

export default class {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._uniqueDays = this._getUniqueDays();
    this._eventsDay = this._uniqueDays.map((day) => this._events.filter((event) => new Date(event.dueDate).toDateString() === day));
    this._daysListComponent = new DaysList();
    this._sortComponent = new Sort();
  }

  init() {
    this._uniqueDays.forEach((data, count) => this._renderDay(data, count));

    render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);

    this._sortComponent.getElement()
      .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
  }

  _getUniqueDays() {
    let dates = new Set();
    this._events.forEach((event) => dates.add(new Date(event.dueDate).toDateString()));
    return Array.from(dates);
  }

  _renderDay(data, count) {
    this._dayComponent = new Day(data, count);
    this._eventsDay[count].forEach((event) => this._renderCard(event, this._dayComponent.getElement().querySelector(`.trip-events__list`)));
    render(this._daysListComponent.getElement(), this._dayComponent.getElement(), Position.BEFOREEND);
  }

  _renderCard(event, list) {
    const cardEventComponent = new CardEvent(event);
    const cardEventEditComponent = new CardEventEdit(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        closeCardEdit();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const openCardEdit = () => {
      list.replaceChild(cardEventEditComponent.getElement(), cardEventComponent.getElement());
    };
    const closeCardEdit = () => {
      list.replaceChild(cardEventComponent.getElement(), cardEventEditComponent.getElement());
    };

    cardEventComponent.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      openCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEventEditComponent.getElement().
    querySelector(`.event__rollup-btn`).
    addEventListener(`click`, () => {
      closeCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEventEditComponent.getElement().
    querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      closeCardEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(list, cardEventComponent.getElement(), Position.BEFOREEND);
  }

  _renderSortedList(sortedEvents) {
    const day = new Day();
    sortedEvents.forEach((event) => this._renderCard(event, day.getElement().querySelector(`.trip-events__list`)));
    render(this._daysListComponent.getElement(), day.getElement(), Position.AFTERBEGIN);
  }

  _onSortInputClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
    switch (evt.target.dataset.sortType) {
      case `event`:
        this._uniqueDays.forEach((data, count) => this._renderDay(data, count));
        break;
      case `price`:
        const sortedByPriceEvent = this._events.slice(0).sort((a, b) => b.price - a.price);
        this._renderSortedList(sortedByPriceEvent);
        break;
      case `time`:
        const sortedByDurationEvent = this._events.sort((a, b) => b.duration - a.duration);
        this._renderSortedList(sortedByDurationEvent);
        break;
    }
  }
}
