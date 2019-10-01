import {getUniqueList, Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Sort from "../components/sort.js";
import TripInfo from "../components/trip-info";
import Filter from "../components/filter";
import moment from "moment";
import StatsController from "./stats";
import PointListController from "./point-list";
import MessageNoPoints from "../components/message-no-points";

export default class {
  constructor(container, tripTotalCostElement, tripInfoContainerElement, filterContainerElement, onDataChange) {
    this._container = container;
    this._pointsSortedByEndDate = [];
    this._sortComponent = new Sort();
    this._daysListComponent = new DaysList();
    this._tripInfoComponent = new TripInfo();
    this._filterComponent = new Filter();
    this._messageNoPointsComponent = new MessageNoPoints();

    this._pointListController = null;
    this._statsController = null;

    this._tripTotalCostElement = tripTotalCostElement;
    this._tripInfoContainerElement = tripInfoContainerElement;
    this._tripInfoTitleElement = this._tripInfoComponent.getElement().querySelector(`.trip-info__title`);
    this._tripInfoDatesElement = this._tripInfoComponent.getElement().querySelector(`.trip-info__dates`);
    this._filterContainerElement = filterContainerElement;

    this._onDataChange = onDataChange;
  }

  init(points) {
    this._points = points.slice().sort((a, b) => a.dates.start - b.dates.start);
    this._pointListController = new PointListController(this._daysListComponent.getElement(), this._points, this._onDataChange);

    if (this._points.length) {
      this._removeMessageNoPoints();
      this._pointsSortedByEndDate = this._points.slice().sort((a, b) => b.dates.end - a.dates.end);

      this._statsController = new StatsController(this._points);

      this._tripTotalCostElement.textContent = this._calculateTotalCost();
      this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
      this._tripInfoDatesElement.textContent = this._getTripInfoDates();
      render(this._container, this._sortComponent.getElement(), Position.BEFOREEND);
      render(this._tripInfoContainerElement, this._tripInfoComponent.getElement(), Position.AFTERBEGIN);
      render(this._filterContainerElement, this._filterComponent.getElement(), Position.BEFOREEND);

      this._filterComponent.getElement().addEventListener(`click`, (evt) => {
        this._appliesFilterToList(evt.target);
      });

      this._sortComponent.getElement()
        .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
    } else {
      this._setDefaultTripInfo();
      render(this._daysListComponent.getElement(), this._messageNoPointsComponent.getElement(), Position.BEFOREEND);
    }

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  update(data) {
    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    if (data.length) {
      this._points = data.slice().sort((a, b) => a.dates.start - b.dates.start);

      this._pointsSortedByEndDate = this._points.slice().sort((a, b) => b.dates.end - a.dates.end);
      this._tripTotalCostElement.textContent = this._calculateTotalCost();
      this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
      this._tripInfoDatesElement.textContent = this._getTripInfoDates();
      this._appliesFilterToList(this._filterComponent.getElement().querySelector(`.trip-filters__filter-input:checked`));
      this._statsController.updateCharts(this._points);
    } else {
      this._setDefaultTripInfo();
      render(this._container, this._messageNoPointsComponent.getElement(), Position.AFTERBEGIN);
    }

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
    this._filterComponent.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
    this._filterComponent.getElement().classList.add(`visually-hidden`);
  }

  createNewPoint() {
    this._pointListController.createNewPoint(this._daysListComponent.getElement());
  }

  _appliesFilterToList(element) {
    unrender(this._daysListComponent.getElement());
    this._daysListComponent.removeElement();

    switch (element.dataset.filterType) {
      case `everything`:
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), this._points, this._daysListComponent.getElement());
        break;
      case `future`:
        const filteredPointsByFuture = this._points.filter(({dates}) => dates.start > moment());
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), filteredPointsByFuture, this._daysListComponent.getElement());
        break;
      case `past`:
        const filteredPointsByPast = this._points.filter(({dates}) => dates.start < moment());
        this._pointListController.renderPointList(this._sortComponent.getElement().querySelector(`.trip-sort__input:checked`), filteredPointsByPast, this._daysListComponent.getElement());
        break;
    }

    render(this._container, this._daysListComponent.getElement(), Position.BEFOREEND);
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
      point.offers.filter((offer) => offer.accepted).forEach((offer) => {
        cost += offer.price;
      });
    }
    return cost;
  }

  _setDefaultTripInfo() {
    this._tripTotalCostElement.textContent = 0;
    this._tripInfoTitleElement.textContent = ``;
    this._tripInfoDatesElement.textContent = ``;
  }

  _removeMessageNoPoints() {
    if (this._daysListComponent.getElement().contains(this._messageNoPointsComponent.getElement())) {
      unrender(this._messageNoPointsComponent.getElement());
      this._messageNoPointsComponent.removeElement();
    }
  }

  _onSortInputClick(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._appliesFilterToList(this._filterComponent.getElement().querySelector(`.trip-filters__filter-input:checked`));
  }
}
