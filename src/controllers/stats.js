import Stats from "../components/stats";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {formatDuration, getUniqueList, groupToType, Position, render} from "../utils";

const Resource = {
  PRICE: `price`,
  TIME: `duration`
};

class StatsController {
  constructor(container) {
    this._container = container;
    this._stats = new Stats();

    this._pointsTypes = [];
    this._uniquePointTypes = [];
    this._pointTypesTransfer = [];
    this._uniquePointTypesTransfer = [];
    this._countTransportTrips = {};

    this._create();
  }

  init(points) {
    this._structureData(points);

    this._moneyChart = new Chart(this._stats.moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        datasets: [{
          data: this._uniquePointTypes.map((type) => this._calculateSpentResourcesByTypes(type, Resource.PRICE, points)),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 12,
            },
            anchor: `end`,
            clamp: `true`,
            align: `start`,
            formatter(value) {
              return value ? `€ ${value} ` : ``;
            }
          }
        },
        title: {
          display: true,
          position: `left`,
          text: `MONEY`,
          fontSize: 32,
          fontColor: `#000000`,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
          }],
          yAxes: [{
            position: `left`,
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
            },
            labels: this._uniquePointTypes.map((type) => type.toUpperCase()),
            barThickness: `flex`,
            minBarLength: 35,
            maxBarThickness: 40
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      },
    });

    this._transportChart = new Chart(this._stats.transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        datasets: [{
          data: this._uniquePointTypesTransfer.map((type) => this._countTransportTrips[type]),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 12,
            },
            anchor: `end`,
            clamp: `true`,
            align: `start`,
            formatter(value) {
              return value ? `${value}x ` : ``;
            }
          }
        },
        title: {
          display: true,
          position: `left`,
          text: `TRANSPORT`,
          fontSize: 32,
          fontColor: `#000000`,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
          }],
          yAxes: [{
            position: `left`,
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
            },
            labels: this._uniquePointTypesTransfer.map((type) => type.toUpperCase()),
            barPercentage: 0.8,
            minBarLength: 55,
            maxBarThickness: 40
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      },
    });

    this._timeChart = new Chart(this._stats.timeCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        datasets: [{
          data: this._uniquePointTypes.map((type) => this._calculateSpentResourcesByTypes(type, Resource.TIME, points)),
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 12,
            },
            anchor: `end`,
            clamp: `true`,
            align: `start`,
            formatter(value) {
              return value ? `${formatDuration(value)} ` : ``;
            }
          }
        },
        title: {
          display: true,
          position: `left`,
          text: `TIME SPENT`,
          fontSize: 32,
          fontColor: `#000000`,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
            minBarLength: 70
          }],
          yAxes: [{
            position: `left`,
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
            },
            labels: this._uniquePointTypes.map((type) => type.toUpperCase()),
            maxBarThickness: 40
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      },
    });
  }

  updateCharts(points) {
    this._structureData(points);
    this._moneyChart.data.datasets.map((dataset) => {
      dataset.data = this._uniquePointTypes.map((type) => this._calculateSpentResourcesByTypes(type, Resource.PRICE, points));
    });
    this._moneyChart.options.scales.yAxes.map((yAxis) => {
      yAxis.labels = this._uniquePointTypes.map((type) => type.toUpperCase());
    });

    this._transportChart.data.datasets.map((dataset) => {
      dataset.data = this._uniquePointTypesTransfer.map((type) => this._countTransportTrips[type]);
    });

    this._transportChart.options.scales.yAxes.map((yAxis) => {
      yAxis.labels = this._uniquePointTypesTransfer.map((type) => type.toUpperCase());
    });

    this._timeChart.data.datasets.map((dataset) => {
      dataset.data = this._uniquePointTypes.map((type) => this._calculateSpentResourcesByTypes(type, Resource.TIME, points));
    });

    this._timeChart.options.scales.yAxes.map((yAxis) => {
      yAxis.labels = this._uniquePointTypes.map((type) => type.toUpperCase());
    });

    this._moneyChart.update();
    this._transportChart.update();
    this._timeChart.update();
  }

  hide() {
    this._stats.hide();
  }

  show() {
    this._stats.show();
  }

  _create() {
    render(this._container, this._stats.element, Position.BEFOREEND);
  }

  _structureData(data) {
    this._pointsTypes = data.map((point) => point.type);
    this._uniquePointTypes = getUniqueList(this._pointsTypes);
    this._pointTypesTransfer = this._pointsTypes.filter((type) => groupToType.transfer.includes(type));
    this._uniquePointTypesTransfer = getUniqueList(this._pointTypesTransfer);
    this._countTransportTrips = this._pointTypesTransfer.reduce((acc, it) => {
      acc[it] = (acc[it] || 0) + 1;
      return acc;
    },
    {});
  }

  _calculateSpentResourcesByTypes(type, resource, points) {
    const filteredByTypePoints = points.filter((point) => point.type === type);
    return filteredByTypePoints.length ? filteredByTypePoints.map((point) => point[resource]).reduce((nextPoint, currentPoint) => nextPoint + currentPoint) : 0;
  }
}

export {StatsController as default};

