export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const prepositionMap = {
  transfer: `to`,
  activity: `in`,
  start: `From`,
  end: `To`
};

export const getUniqueDates = (mocks) => {
  let dates = new Set();
  mocks.sort((a, b) => a.dueDate - b.dueDate).map((mock) => dates.add(new Date(mock.dueDate).toDateString()));
  return Array.from(dates);
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

