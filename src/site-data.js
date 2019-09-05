import moment from "moment";
const COUNT_PHOTOS = 5;

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

const getSrcPhotos = () => {
  const photos = new Set();
  while (photos.size < COUNT_PHOTOS) {
    photos.add(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return photos;
};

const getRandomArray = (arr, max, min) => {
  let count = getRandomInt(max, min);
  let mySet = new Set();
  while (mySet.size < count) {
    mySet.add(arr[getRandomInt(arr.length)]);
  }
  return Array.from(mySet);
};

export const cities = [
  `Saint Petersburg`,
  `Geneva`,
  `Amsterdam`,
  `Chamonix`,
  `Moscow`,
  `Samara`,
  `Yekaterinburg`,
  `Berlin`,
  `Dresden`,
  `Greensboro`,
  `Brooklyn`
];

export const getPointMock = function () {
  return ({
    type: [
      {
        transfer: [
          `Taxi`,
          `Bus`,
          `Train`,
          `Ship`,
          `Transport`,
          `Drive`,
          `Flight`,
        ][getRandomInt(7)]
      },
      {
        activity: [
          `Check-in`,
          `Sightseeing`,
          `Restaurant`
        ][getRandomInt(3)]
      }
    ][getRandomInt(2)],
    city: cities[getRandomInt(11)],
    photos: getSrcPhotos(),
    description: getRandomArray(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
  sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `), 4, 1).join(``),
    date: Date.parse(moment().subtract(3, `days`).add(getRandomInt(6), `days`).year(2019).hours(0).minutes(0).seconds(0)),
    time: [
      {
        start: `11:00`,
        end: `12:30`
      },
      {
        start: `11:00`,
        end: `12:30`
      },
      {
        start: `15:00`,
        end: `16:00`
      },
      {
        start: `17:00`,
        end: `19:30`
      }
    ][getRandomInt(3)],
    price: getRandomInt(400, 20),
    options: getRandomArray([
      {
        title: `Add luggage`,
        price: 10,
        isApplied: Boolean(Math.round(Math.random()))
      },
      {
        title: `Switch to comfort`,
        price: 150,
        isApplied: Boolean(Math.round(Math.random()))
      },
      {
        title: `Add meal`,
        price: 2,
        isApplied: Boolean(Math.round(Math.random()))
      },
      {
        title: `Choose seats`,
        price: 9,
        isApplied: Boolean(Math.round(Math.random()))
      }], 3, 0),
  });
};

export const navItems = [
  {
    title: `Table`,
    isActive: false,
  },
  {
    title: `Stats`,
    isActive: true,
  },
];

export const filterItems = [
  {
    title: `Everything`,
    isActive: true,
  },
  {
    title: `Future`,
    isActive: false,
  },
  {
    title: `Past`,
    isActive: false,
  }
];

