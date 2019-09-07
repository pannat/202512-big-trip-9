import {calculateDuration, Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Day from "../components/day";
import PointController from "./point";
import Sort from "../components/sort.js";
import moment from "moment";

export default class {
  constructor(container, points) {
    this._container = container;
    this._points = points.sort((a, b) => a.dates.start - b.dates.start);
    this._daysListComponent = new DaysList();
    this._sortComponent = new Sort();

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);


    this._getUniqueDays();
    this._getPointsDays();
  }

  init() {
    this._uniqueDays.forEach((data, count) => this._renderDay(this._pointsDays[count], data, count));

    render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);

    this._sortComponent.getElement()
      .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
  }

  _getUniqueDays() {
    let dates = new Set();
    this._points.forEach((point) => dates.add(moment(point.dates.start).format(`MMM DD YYYY`)));
    this._uniqueDays = Array.from(dates);
  }

  _getPointsDays() {
    this._pointsDays = this._uniqueDays.map((day) => this._points.filter((point) => moment(point.dates.start).format(`MMM DD YYYY`) === day));
  }

  _renderDay(points, date, dayNumber) {
    const day = new Day(points.length, date, dayNumber);
    const pointsContainers = day.getElement().querySelectorAll(`.trip-events__item`);
    points.forEach((point, index) => this._renderPoint(pointsContainers[index], point));
    render(this._daysListComponent.getElement(), day.getElement(), Position.BEFOREEND);
  }

  _renderPoint(container, point) {
    const pointController = new PointController(container, point, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _renderTrip(element) {
    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    switch (element.dataset.sortType) {
      case `event`:
        this._uniqueDays.forEach((data, count) => this._renderDay(this._pointsDays[count], data, count));
        break;
      case `price`:
        this._renderDay(this._points.slice(0).sort((a, b) => b.price - a.price));
        break;
      case `time`:
        this._renderDay(this._points.sort((a, b) => b.duration - a.duration));
        break;
    }
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  _onDataChange(newData, oldData) {
    this._points[this._points.findIndex((it) => it === oldData)] = newData;
    this._points.sort((a, b) => a.dates.start - b.dates.start).forEach((point) => calculateDuration(point));
    this._getUniqueDays();
    this._getPointsDays(this._uniqueDays);

    this._renderTrip(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onSortInputClick(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._renderTrip(evt.target);
  }
}
