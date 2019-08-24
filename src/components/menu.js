export const createMenuTemplate = (items) => `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${items.map((item) => `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : `` }" href="#">${item.title}</a>`).join(``)}
   </nav>`.trim();

