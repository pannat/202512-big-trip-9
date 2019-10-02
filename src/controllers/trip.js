import {getUniqueList, Position, render, unrender} from "../utils";
import DaysList from "../components/days-list";
import Sort from "../components/sort.js";
import TripInfo from "../components/trip-info";
import Filter from "../components/filter";
import moment from "moment";
import PointListController from "./point-list";
import MessageNoPoints from "../components/message-no-points";

class TripController {
  constructor(container, tripTotalCostElement, tripInfoContainerElement, filterContainerElement, onDataChange) {
    this._container = container;
    this._pointsSortedByEndDate = [];
    this._sortComponent = new Sort();
    this._daysListComponent = new DaysList();
    this._tripInfoComponent = new TripInfo();
    this._filterComponent = new Filter();
    this._messageNoPointsComponent = new MessageNoPoints();

    this._pointListController = null;

    this._tripTotalCostElement = tripTotalCostElement;
    this._tripInfoContainerElement = tripInfoContainerElement;
    this._filterContainerElement = filterContainerElement;
    this._tripInfoTitleElement = this._tripInfoComponent.element.querySelector(`.trip-info__title`);
    this._tripInfoDatesElement = this._tripInfoComponent.element.querySelector(`.trip-info__dates`);

    this._onDataChange = onDataChange;
  }

  init(points) {
    this._points = points.slice().sort((a, b) => a.dates.start - b.dates.start);
    this._pointListController = new PointListController(this._daysListComponent.element, this._points, this._onDataChange);

    if (this._points.length) {
      this._removeMessageNoPoints();
      this._pointsSortedByEndDate = this._points.slice().sort((a, b) => b.dates.end - a.dates.end);

      this._tripTotalCostElement.textContent = this._calculateTotalCost();
      this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
      this._tripInfoDatesElement.textContent = this._getTripInfoDates();
      render(this._container, this._sortComponent.element, Position.BEFOREEND);
      render(this._tripInfoContainerElement, this._tripInfoComponent.element, Position.AFTERBEGIN);
      render(this._filterContainerElement, this._filterComponent.element, Position.BEFOREEND);

      this._filterComponent.element.addEventListener(`click`, (evt) => {
        this._appliesFilterToList(evt.target);
      });

      this._sortComponent.element
        .addEventListener(`click`, (evt) => this._onSortInputClick(evt));
    } else {
      this._setDefaultTripInfo();
      render(this._daysListComponent.element, this._messageNoPointsComponent.element, Position.BEFOREEND);
    }

    render(this._container, this._daysListComponent.element, Position.BEFOREEND);
  }

  update(points) {
    unrender(this._daysListComponent.element);
    this._daysListComponent.removeElement();

    if (points.length) {
      this._points = points.slice().sort((a, b) => a.dates.start - b.dates.start);

      if (this._sortComponent.element.classList.contains(`visually-hidden`)) {
        this._sortComponent.element.classList.remove(`visually-hidden`);
      }

      this._pointsSortedByEndDate = this._points.slice().sort((a, b) => b.dates.end - a.dates.end);
      this._tripTotalCostElement.textContent = this._calculateTotalCost();
      this._tripInfoTitleElement.textContent = this._getTripInfoTitle();
      this._tripInfoDatesElement.textContent = this._getTripInfoDates();
      this._appliesFilterToList(this._filterComponent.element.querySelector(`.trip-filters__filter-input:checked`));
    } else {
      this._filterComponent.element.classList.add(`visually-hidden`);
      this._sortComponent.element.classList.add(`visually-hidden`);
      this._setDefaultTripInfo();
      render(this._daysListComponent.element, this._messageNoPointsComponent.element, Position.BEFOREEND);
    }

    render(this._container, this._daysListComponent.element, Position.BEFOREEND);
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
    this._filterComponent.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
    this._filterComponent.element.classList.add(`visually-hidden`);
  }

  createNewPoint() {
    this._pointListController.createNewPoint(this._daysListComponent.element);
  }

  _appliesFilterToList(element) {
    unrender(this._daysListComponent.element);
    this._daysListComponent.removeElement();

    switch (element.dataset.filterType) {
      case `everything`:
        this._pointListController.renderPointList(this._sortComponent.element.querySelector(`.trip-sort__input:checked`), this._points, this._daysListComponent.element);
        break;
      case `future`:
        const filteredPointsByFuture = this._points.filter(({dates}) => dates.start > moment());
        this._pointListController.renderPointList(this._sortComponent.element.querySelector(`.trip-sort__input:checked`), filteredPointsByFuture, this._daysListComponent.element);
        break;
      case `past`:
        const filteredPointsByPast = this._points.filter(({dates}) => dates.start < moment());
        this._pointListController.renderPointList(this._sortComponent.element.querySelector(`.trip-sort__input:checked`), filteredPointsByPast, this._daysListComponent.element);
        break;
    }

    render(this._container, this._daysListComponent.element, Position.BEFOREEND);
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
    if (this._daysListComponent.element.contains(this._messageNoPointsComponent.element)) {
      unrender(this._messageNoPointsComponent.element);
      this._messageNoPointsComponent.removeElement();
    }
  }

  _onSortInputClick(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._appliesFilterToList(this._filterComponent.element.querySelector(`.trip-filters__filter-input:checked`));
  }
}

export {TripController as default};
