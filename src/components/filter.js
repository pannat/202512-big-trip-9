export const createFilterTemplate = (filters) => `<form class="trip-filters" action="#" method="get">
              ${filters.map((filter) => `<div class="trip-filters__filter">
                <input id="filter-${filter.title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.title.toLowerCase()}"
                ${filter.isActive ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-${filter.title.toLowerCase()}">${filter.title}</label>
              </div>`).join(``)}

              <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`.trim();

