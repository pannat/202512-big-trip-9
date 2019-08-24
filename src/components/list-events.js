import {createCardTemplate} from "./card";
import {createEventEditTemplate} from "./event-edit";

export const createListEventsTemplate = (waypoints) => `<ul class="trip-days">
            ${Array.from(getUnicueDates(waypoints)).map((date, count) => `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${count + 1}</span>
                 <time class="day__date" datetime="${new Date(date).toISOString().slice(0, 10)}">${date.slice(3, 10)}</time>
              </div>
              <ul class="trip-events__list">
                 ${new Date(waypoints[0].date).toDateString() === date ? createEventEditTemplate(waypoints[0]) : `` }
                 ${waypoints.slice(1).filter((waypoint) => new Date(waypoint.date).toDateString() === date).map(createCardTemplate).join(``)}
              </ul>
            </li>
                `).join(``)}
        </ul>`.trim();

export const getUnicueDates = (waypoints) => {
  let dates = new Set();
  waypoints.slice().sort((a, b) => a.date - b.date).map((waypoint) => dates.add(new Date(waypoint.date).toDateString()));
  return dates;
};

