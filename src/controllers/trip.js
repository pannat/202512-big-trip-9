import EventList from "../components/events-list";
import {Position, render} from "../utils";
import CardEvent from "../components/card-event";
import CardEventEdit from "../components/card-event-edit";

export default class {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._uniqueDates = this._getUniqueDates();
    this._eventDays = this._uniqueDates.map((day) => this._events.filter((event) => new Date(event.dueDate).toDateString() === day));
    this._eventsList = new EventList(this._uniqueDates);
  }

  init() {
    this._eventsList.getElement().
    querySelectorAll(`.trip-events__list`).forEach((list, index) => {
      this._eventDays[index].forEach((event) => this._renderCard(event, list));
    });
    render(this._container, this._eventsList.getElement(), Position.BEFOREEND);
  }

  _getUniqueDates() {
    let dates = new Set();
    this._events.forEach((event) => dates.add(new Date(event.dueDate).toDateString()));
    return Array.from(dates);
  }

  _renderCard(event, list) {
    const cardEventComponent = new CardEvent(event);
    const cardEventEditComponent = new CardEventEdit(event);

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === 27) {
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
}
