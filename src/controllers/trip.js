import {Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import PointListController from "./point-list";
import Sort from "../components/sort.js";
import TripInfo from "../components/trip-info";
import moment from "moment";

export default class {
  constructor(container, points, tripTotalCostElement, tripInfoContainerElement) {
    this._container = container;
    this._points = points.slice(0).sort((a, b) => a.dates.start - b.dates.start);
    this._pointsSortedByEndDate = this._points.slice(0).sort((a, b) => b.dates.end - a.dates.end);
    this._daysListComponent = new DaysList();
    this._sortComponent = new Sort();
    this._tripInfoComponent = new TripInfo();
    this._pointListController = new PointListController(this._daysListComponent.getElement(), this._points, this._onDataChange.bind(this));

    this._tripTotalCostElement = tripTotalCostElement;
    this._tripInfoContainerElement = tripInfoContainerElement;
    this._tripInfoTitleElement = this._tripInfoComponent.getElement().querySelector(`.trip-info__title`);
    this._tripInfoDatesElement = this._tripInfoComponent.getElement().querySelector(`.trip-info__dates`);

    this._init();
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
  }

  createNewPoint() {
    this._pointListController.createNewPoint();
  }

  _init() {
    this._tripTotalCostElement.textContent = this._calculateTotalCost();
    this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
    this._tripInfoDatesElement.textContent = this._getTripInfoDates();

    render(this._tripInfoContainerElement, this._tripInfoComponent.getElement(), Position.AFTERBEGIN);
    render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);

    this._sortComponent.getElement()
      .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
  }

  _getUniqueCities() {
    const uniqueCities = new Set();
    this._points.forEach((point) => uniqueCities.add(point.city));
    return Array.from(uniqueCities);
  }

  _getTripInfoTitle() {
    const uniqueCities = this._getUniqueCities();
    return uniqueCities.length === 3 ? `${uniqueCities.map((city) => city).join(` — `)}`
      : `${this._points[0].city} — ... — ${this._pointsSortedByEndDate[0].city}`;
  }

  _getTripInfoDates() {
    return `${moment(this._points[0].dates.start).format(`MMM DD`)} — ${moment(this._pointsSortedByEndDate[0].dates.end).format(`DD MMM`)}`;
  }

  _calculateTotalCost() {
    let cost = 0;
    for (let point of this._points) {
      cost += point.price;
      point.options.filter((option) => option.isApplied).forEach((option) => {
        cost += option.price;
      });
    }
    return cost;
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
    this._tripTotalCostElement.textContent = this._calculateTotalCost();

    this._pointsSortedByEndDate = this._points.slice(0).sort((a, b) => b.dates.end - a.dates.end);
    this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
    this._tripInfoDatesElement.textContent = this._getTripInfoDates();

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();
    this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), this._points, this._daysListComponent.getElement());
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  _onSortInputClick(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();
    this._pointListController.renderPointList(evt.target, this._points, this._daysListComponent.getElement());
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }
}
