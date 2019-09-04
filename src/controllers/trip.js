import {Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Day from "../components/day";
import PointController from "./point";
import Sort from "../components/sort.js";
import moment from "moment";

export default class {
  constructor(container, points) {
    this._container = container;
    this._points = points;
    this._daysListComponent = new DaysList();
    this._sortComponent = new Sort();
    this._uniqueDays = this._getUniqueDays();
    this._pointsDay = this._getPointsDay(this._uniqueDays);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    this._uniqueDays.forEach((data, count) => this._renderDay(this._pointsDay[count], data, count));

    render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);

    this._sortComponent.getElement()
      .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
  }

  _onDataChange(newData, oldData) {
    this._points[this._points.findIndex((it) => it === oldData)] = newData;
    this._renderTrip();
  }

  _renderTrip() {
    const uniqueDays = this._getUniqueDays();
    const pointsDays = this._getPointsDay(uniqueDays);
    unrender(this._daysListComponent.getElement());

    this._daysListComponent.removeElement();
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
    uniqueDays.forEach((data, count) => this._renderDay(pointsDays[count], data, count));
  }

  _getUniqueDays() {
    let dates = new Set();
    this._points.forEach((point) => dates.add(moment(point.date).format(`MMM DD YYYY`)));
    return Array.from(dates);
  }

  _getPointsDay(uniqueDays) {
    return uniqueDays.map((day) => this._points.filter((point) => moment(point.date).format(`MMM DD YYYY`) === day));
  }

  _renderDay(pointsDay, date, dayNumber) {
    this._dayComponent = new Day(pointsDay.length, date, dayNumber);
    const pointsContainers = this._dayComponent.getElement().querySelectorAll(`.trip-events__item`);
    pointsDay.forEach((point, index) => this._renderPoint(pointsContainers[index], point));
    render(this._daysListComponent.getElement(), this._dayComponent.getElement(), Position.BEFOREEND);
  }

  _renderPoint(container, point) {
    const pointController = new PointController(container, point, this._onDataChange);
  }

  _onSortInputClick(evt) {
    const renderSortedList = (sortedPoints) => {
      const day = new Day(sortedPoints.length);

      const pointsContainers = day.getElement().querySelectorAll(`.trip-events__item`);
      sortedPoints.forEach((point, index) => this._renderPoint(pointsContainers[index], point));
      render(this._daysListComponent.getElement(), day.getElement(), Position.AFTERBEGIN);
    };

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
    switch (evt.target.dataset.sortType) {
      case `event`:
        this._uniqueDays.forEach((day, count) => this._renderDay(this._pointsDay[count], day, count));
        break;
      case `price`:
        const sortedByPricePoints = this._points.slice(0).sort((a, b) => b.price - a.price);
        renderSortedList(sortedByPricePoints);
        break;
      case `time`:
        const sortedByDurationPoints = this._points.sort((a, b) => b.duration - a.duration);
        renderSortedList(sortedByDurationPoints);
        break;
    }
  }
}
