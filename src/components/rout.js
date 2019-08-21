import {getUnicueDates} from "./list-events";

export const createRoutTemplate = (waypoints) => `<div class="trip-info__main">
            <h1 class="trip-info__title">${getTripTitle(waypoints)}</h1>
            <p class="trip-info__dates">${getTripDates(waypoints)}</p>
            </div>`.trim();

const getTripTitle = (waypoints) => {
  let citiesSet = new Set();
  waypoints.sort((a, b) => a.date - b.date).map((waypoint) => citiesSet.add(waypoint.city));
  let citiesArr = Array.from(citiesSet);
  return citiesArr.length === 3 ? `${citiesArr[0]} &mdash; ${citiesArr[1]} &mdash; ${citiesArr[2]}` : `${citiesArr[0]} &mdash; ... &mdash; ${citiesArr[citiesArr.length - 1]}`
};

const getTripDates = (waypoints) => {
  let dates = Array.from(getUnicueDates(waypoints));
  return `${dates[0].slice(4, 11)} &mdash; ${dates[dates.length - 1].slice(7, 11)}`;
};
