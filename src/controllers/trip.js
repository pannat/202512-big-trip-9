import {cities} from "../site-data";
import {Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Day from "../components/day";
import PointController from "./point";
import NewPointController from "./new-point";
import Sort from "../components/sort.js";
import moment from "moment";

export default class {
  constructor(container, points, setTotalCost) {
    this._container = container;
    this._points = points.slice(0).sort((a, b) => a.dates.start - b.dates.start);
    this._daysListComponent = new DaysList();
    this._sortComponent = new Sort();

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._setTotalCost = setTotalCost;

    this._calculateDurationPoints();
    this._getUniqueDays();
    this._getPointsDays();
  }

  init() {
    this._uniqueDays.forEach((data, count) => this._createDay(this._pointsDays[count], data, count));
    this._setTotalCost(this._points);

    render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);

    this._sortComponent.getElement()
      .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
  }

  createNewPoint() {
    const defaultPoint = {
      type: {
        transfer: `Taxi`
      },
      city: cities[0],
      dates: {
        start: Date.parse(moment()),
        end: Date.parse(moment().add(1, `hours`)),
      },
      photos: new Set(),
      price: +0,
      description: ``,
      options: []
    };

    this._createPoint(this._daysListComponent.getElement(), defaultPoint, NewPointController);
  }

  _calculateDurationPoints() {
    for (const point of this._points) {
      point.duration = moment(point.dates.end).diff(moment(point.dates.start));
    }
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
  }

  _getUniqueDays() {
    let dates = new Set();
    this._points.forEach((point) => dates.add(moment(point.dates.start).format(`MMM DD YYYY`)));
    this._uniqueDays = Array.from(dates);
  }

  _getPointsDays() {
    this._pointsDays = this._uniqueDays.map((day) => this._points.filter((point) => moment(point.dates.start).format(`MMM DD YYYY`) === day));
  }

  _createDay(points, date, dayNumber) {
    const day = new Day(points.length, date, dayNumber);
    const pointsContainers = day.getElement().querySelectorAll(`.trip-events__item`);
    points.forEach((point, index) => this._createPoint(pointsContainers[index], point, PointController));
    render(this._daysListComponent.getElement(), day.getElement(), Position.BEFOREEND);
  }

  _createPoint(container, point, Controller) {
    const pointController = new Controller(container, point, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _renderTrip(element) {
    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    switch (element.dataset.sortType) {
      case `event`:
        this._uniqueDays.forEach((data, count) => this._createDay(this._pointsDays[count], data, count));
        break;
      case `price`:
        this._createDay(this._points.slice(0).sort((a, b) => b.price - a.price));
        break;
      case `time`:
        this._createDay(this._points.sort((a, b) => b.duration - a.duration));
        break;
    }
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  _onDataChange(newData, oldData) {
    const index = +[this._points.findIndex((point) => point === oldData)];
    if (newData === null) {
      this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];
    } else if (oldData === null) {
      this._points = [newData, ...this._points];
    } else {
      this._points[index] = newData;
    }

    this._points.sort((a, b) => a.dates.start - b.dates.start);
    this._calculateDurationPoints();
    this._getUniqueDays();
    this._getPointsDays(this._uniqueDays);
    this._setTotalCost(this._points);

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
