import moment from "moment";
import Day from "../components/day";
import PointController from "./point";
import NewPointController from "./new-point";
import {Position, render, getUniqueList} from "../utils";


export default class {
  constructor(container, points, onDataChange) {
    this._container = container;
    this._points = points;
    this._subscriptions = [];
    this._uniqueDays = [];
    this._pointsDays = [];


    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = onDataChange;

    this._getUniqueDays();
    this._getPointsDays();

    this._init();
  }

  createNewPoint(container) {
    const defaultPoint = {
      type: ``,
      city: ``,
      dates: {
        start: Date.parse(moment()),
        end: Date.parse(moment().add(1, `hours`)),
      },
      photos: [],
      price: +0,
      description: ``,
      options: []
    };

    this._createPoint(container, defaultPoint, NewPointController);
  }

  renderPointList(element, points, container) {
    this._points = points;
    this._container = container;

    switch (element.dataset.sortType) {
      case `event`:
        this._getUniqueDays();
        this._getPointsDays();
        this._uniqueDays.forEach((data, count) => this._createDay(this._pointsDays[count], data, count));
        break;
      case `price`:
        this._createDay(this._points.slice(0).sort((a, b) => b.price - a.price));
        break;
      case `time`:
        this._createDay(this._points.sort((a, b) => b.duration - a.duration));
        break;
    }
  }

  _init() {
    this._uniqueDays.forEach((data, count) => this._createDay(this._pointsDays[count], data, count));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _getUniqueDays() {
    this._uniqueDays = getUniqueList(this._points.map((point) => moment(point.dates.start).format(`MMM DD YYYY`)));
  }

  _getPointsDays() {
    this._pointsDays = this._uniqueDays.map((day) => this._points.filter((point) => moment(point.dates.start).format(`MMM DD YYYY`) === day));
  }

  _createDay(points, date, dayNumber) {
    const day = new Day(points.length, date, dayNumber);
    const pointsContainers = day.getElement().querySelectorAll(`.trip-events__item`);
    points.forEach((point, index) => this._createPoint(pointsContainers[index], point, PointController));
    render(this._container, day.getElement(), Position.BEFOREEND);
  }

  _createPoint(container, point, Controller) {
    const pointController = new Controller(container, point, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }
}
