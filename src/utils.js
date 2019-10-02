import moment from "moment";

const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`,
};

const groupToType = {
  transfer: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  activity: [`Check-in`, `Sightseeing`, `Restaurant`]
};

const groupToPreposition = {
  transfer: `to`,
  activity: `in`
};

const getPreposition = (type) => {
  let preposition = ``;
  for (let group in groupToType) {
    if (groupToType[group].includes(type)) {
      preposition = groupToPreposition[group];
      break;
    }
  }
  return preposition;
};

const getUniqueList = (list) => Array.from(new Set(list));

const formatDuration = (duration) => {
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


const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export {Position, Key, groupToType, getPreposition, getUniqueList, formatDuration, createElement, render, unrender};
