import {Position, render, getUniqueList} from "../utils";
import moment from "moment";
import Day from "../components/day";
import PointController from "./point";
import NewPointController from "./new-point";
import ModelPoint from "../model-point";

const SortType = {
  EVENT: `event`,
  PRICE: `price`,
  TIME: `time`
};

class PointListController {
  constructor(container, points, onDataChange) {
    this._container = container;
    this._points = points;
    this._subscriptions = [];
    this._uniqueDays = [];
    this._pointsDays = [];
    this._newPointController = null;


    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = onDataChange;

    this._getUniqueDays();
    this._getPointsDays();

    this._init();
  }

  createNewPoint(container) {

    if (this._newPointController) {
      return;
    }

    const localPoint = {
      [`id`]: String(this._points.length),
      [`base_price`]: 0,
      [`date_from`]: moment().format(),
      [`date_to`]: moment().add(1, `hour`).format(),
      [`destination`]: {
        name: ``,
        pictures: [],
        description: ``
      },
      [`is_favorite`]: false,
      [`offers`]: [],
      [`type`]: ``
    };

    this._newPointController = new NewPointController(container, new ModelPoint(localPoint), this._onDataChange, this._onChangeView, () => {
      this._newPointController = null;
    });

    this._subscriptions.push(this._newPointController.setDefaultView.bind(this._newPointController));
  }

  renderPointList(element, points, container) {
    this._points = points;
    this._container = container;

    if (this._newPointController) {
      this._newPointController = null;
    }

    switch (element.dataset.sortType) {
      case SortType.EVENT:
        this._getUniqueDays();
        this._getPointsDays();
        this._uniqueDays.forEach((data, count) => this._createDay(this._pointsDays[count], data, count));
        break;
      case SortType.PRICE:
        this._createDay(this._points.slice(0).sort((a, b) => b.price - a.price));
        break;
      case SortType.TIME:
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
    const pointsContainers = day.element.querySelectorAll(`.trip-events__item`);
    points.forEach((point, index) => this._createPoint(pointsContainers[index], point));
    render(this._container, day.element, Position.BEFOREEND);
  }

  _createPoint(container, data) {
    const pointController = new PointController(container, data, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }
}

export {PointListController as default};
