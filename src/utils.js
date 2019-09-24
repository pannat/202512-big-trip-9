import moment from "moment";

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const prepositionMap = {
  taxi: `to`,
  bus: `to`,
  train: `to`,
  flight: `to`,
  [`check-in`]: `in`,
  sightseeing: `in`,
  start: `From`,
  end: `To`
};

export const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
};

export const getUniqueList = (list) => Array.from(new Set(list));

export const formatDuration = (duration) => {
  const setFormatUnitTime = (unit) => {
    return unit > 9 ? unit : `0${unit}`;
  };

  const durationBreakByUnit = {
    day: setFormatUnitTime(moment.duration(duration).days()),
    hours: setFormatUnitTime(moment.duration(duration).hours()),
    minutes: setFormatUnitTime(moment.duration(duration).minutes())
  };

  return `${+durationBreakByUnit.day ? `${durationBreakByUnit.day}D ${durationBreakByUnit.hours}H` :
    `${+durationBreakByUnit.hours ? `${durationBreakByUnit.hours}H` : ``}` } ${durationBreakByUnit.minutes}M`;
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

