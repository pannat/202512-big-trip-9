import moment from "moment";

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

export const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
};

export const calculateDuration = (point) => {
  const formatedDate = moment(point.date).format(`YYYY-MM-DD`);
  point.duration = moment(`${formatedDate} ${point.time.end}`).diff(`${formatedDate} ${point.time.start}`, `minutes`);
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

