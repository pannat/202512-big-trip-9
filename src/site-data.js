const COUNT_PHOTOS = 5;
const DAY = 24 * 60 * 60 * 1000;

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

export const waypoint = {
  type: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ][getRandomInt(10)],
  city: [
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
  ][getRandomInt(11)],
  photos: getSrcPhotos(),
  description: getRandomArray(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
  sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `), 3, 1).join(``),
  data: [
    Date.now(),
    Date.now() + DAY,
    Date.now() + DAY * 2
  ][getRandomInt(3)],
  time: new Set(),
  options: getRandomArray([
    {
      title: `Add luggage`,
      price: 10,
      isActive: Boolean(Math.round(Math.random()))
    },
    {
      title: `Switch to comfort class`,
      price: 150,
      isActive: Boolean(Math.round(Math.random()))
    },
    {
      title: `Add meal`,
      price: 2,
      isActive: Boolean(Math.round(Math.random()))
    },
    {
      title: `Choose seats`,
      price: 9,
      isActive: Boolean(Math.round(Math.random()))
    }], 3, 0)
};


