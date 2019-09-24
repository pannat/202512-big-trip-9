import {getUniqueList, Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import PointListController from "./point-list";
import Sort from "../components/sort.js";
import TripInfo from "../components/trip-info";
import moment from "moment";
import StatsController from "./stats";

export default class {
  constructor(container, points, tripTotalCostElement, tripInfoContainerElement) {
    this._container = container;
    this._points = points.slice(0).sort((a, b) => a.dates.start - b.dates.start);
    this._pointsSortedByEndDate = this._points.slice(0).sort((a, b) => b.dates.end - a.dates.end);
    this._sortComponent = new Sort();
    this._daysListComponent = new DaysList();
    this._tripInfoComponent = new TripInfo();
    this._calculateDurationPoints();
    this._pointListController = new PointListController(this._daysListComponent.getElement(), this._points, this._onDataChange.bind(this));
    this._statsController = new StatsController(this._points);
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
    this._pointListController.createNewPoint(this._daysListComponent.getElement());
  }

  appliesFilterToList(filter) {
    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    switch (filter.value) {
      case `everything`:
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), this._points, this._daysListComponent.getElement());
        break;
      case `future`:
        const filteredPointsByFuture = this._points.filter(({dates}) => dates.start > moment().add(1, `day`));
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), filteredPointsByFuture, this._daysListComponent.getElement());
        break;
      case `past`:
        const filteredPointsByPast = this._points.filter(({dates}) => dates.start < moment());
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), filteredPointsByPast, this._daysListComponent.getElement());
        break;
    }

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
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

  _calculateDurationPoints() {
    for (const point of this._points) {
      point.duration = moment(point.dates.end).diff(moment(point.dates.start));
    }
  }

  _getUniqueCities() {
    return getUniqueList(this._points.map((point) => point.city));
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

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    if (this._points.length) {
      this._calculateDurationPoints();
      this._points.sort((a, b) => a.dates.start - b.dates.start);

      this._pointsSortedByEndDate = this._points.slice(0).sort((a, b) => b.dates.end - a.dates.end);
      this._tripTotalCostElement.textContent = this._calculateTotalCost();
      this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
      this._tripInfoDatesElement.textContent = this._getTripInfoDates();
      this.appliesFilterToList(document.querySelector(`.trip-filters__filter-input:checked`));
      this._statsController.updateCharts(this._points);
    } else {
      this._tripTotalCostElement.textContent = 0;
      this._tripInfoTitleElement.textContent = ``;
      this._tripInfoDatesElement.textContent = ``;
    }

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  _onSortInputClick(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();
    this.appliesFilterToList(document.querySelector(`.trip-filters__filter-input:checked`));
    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }
}
