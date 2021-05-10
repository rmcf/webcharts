<template>
  <div>
    <div class="text-h3 q-mt-lg text-center text-grey-8 text-weight-light">
      Budget onderzoeksprojecten
    </div>
    <div class="q-pa-lg">
      <!-- buttons -->
      <div class="q-mt-md q-mb-md">
        <!-- button groups -->
        <q-btn-group>
          <q-btn
            @click="buildChart()"
            color="red"
            icon="cached"
            label="update"
          />
        </q-btn-group>
        <q-spinner-ios
          v-if="dataLoadingStatus"
          class="q-ml-md q-mr-md"
          color="light-blue"
          size="2em"
        />
      </div>

      <!-- highcharts -->
      <div v-if="chart.chartOptions" class="q-mb-lg">
        <q-card>
          <q-card-section>
            <div class="q-pa-md">
              <highcharts :options="chart.chartOptions"></highcharts>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- table with data -->
      <div class="q-mb-lg">
        <q-markup-table v-if="chart">
          <thead>
            <tr>
              <th
                v-for="title in chart.tableHeader"
                :key="title"
                class="text-left"
              >
                {{ title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in chart.tableData" :key="item.nid">
              <td v-for="(value, key) in item" :key="key" class="text-left">
                {{ value }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td
                v-for="item in chart.tableSums"
                :key="item"
                class="text-right"
              >
                <strong>{{ item.toFixed(2) }}</strong>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>

<script>
// import EssentialLink from "components/EssentialLink.vue";
import Vue from "vue";
// highcharts
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
Vue.use(Chart);
exportingInit(Highcharts);
// lodash
import VueLodash from "vue-lodash";
import cloneDeep from "lodash";
// import { delete } from "got";
const _ = require("lodash");

Vue.use(VueLodash, { name: "cloneDeep", lodash: { cloneDeep } });

export default {
  name: "Budget",
  components: { highcharts: Chart },
  data() {
    return {
      leftDrawerOpen: true,
      dataLoadingStatus: false,
      chart: false
    };
  },
  methods: {
    // remove array empty properties
    removeArrayEmptyProperties(array) {
      var objectsQuantity = array.length; // quantity of financerings
      var propertiesQuantity = Object.keys(array[0]).length; // quantity of properties
      var removingKeys = []; // array of keys of empty properties
      for (let counter = 0; counter < propertiesQuantity; counter++) {
        let counterEmpty = 0;
        array.forEach(function(item) {
          let key = Object.keys(item)[counter]; // key of this item
          let value = item[key]; // value of this property
          if (value === "" || value === "0" || value === "0.00") {
            counterEmpty = counterEmpty + 1;
            if (counterEmpty == objectsQuantity) {
              removingKeys.push(key);
            }
          }
        });
      }
      if (removingKeys.length > 0) {
        array.forEach(function(itemFin) {
          removingKeys.forEach(function(itemKey) {
            delete itemFin[itemKey];
          });
        });
      } // removing empty keys and properties in financerings array
      return array;
    },

    // remove array any properties
    removeArrayProperties(array, properties) {
      var newArray = _.cloneDeep(array); // new array of financerings for table
      // defining table data
      newArray.forEach(item => {
        properties.forEach(prop => {
          let key = prop;
          delete item[key];
        });
      });
      return newArray;
    },

    // column chart series
    columnChartSeries(array) {
      let newArray = _.cloneDeep(array);
      // column chart series
      var chartSeries = [];
      newArray.forEach(function(item) {
        var financeringObj = {};
        var data = [];
        var name = "";
        for (let [key, value] of Object.entries(item)) {
          if (
            key !== "nid" &&
            key !== "field_proj_financiering" &&
            key !== "field_fin_color"
          ) {
            data.push(parseFloat(value));
          }
          if (key === "field_proj_financiering") {
            name = value;
          }
          financeringObj.name = name;
          financeringObj.data = data;
          financeringObj.type = "column";
        }
        financeringObj.color = item.field_fin_color;
        chartSeries.push(financeringObj);
      });
      return chartSeries;
    },

    // column chart categories
    columnChartCategories(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayCleaned = this.removeArrayProperties(arrayNew, [
        "nid",
        "field_proj_financiering",
        "field_fin_color"
      ]);
      var chartCategories = [];
      for (let key of Object.keys(arrayCleaned[0])) {
        let year = key.slice(-4);
        chartCategories.push(year);
      }
      return chartCategories;
    },

    // spline chart data
    splineChartData(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_fin_color"
      ]);
      var singleObjArrayCleaned = arrayNewCleaned[0];
      var singleObjArrayCleanedKeys = Object.keys(singleObjArrayCleaned);
      var splinePropertiesQuantity = singleObjArrayCleanedKeys.length; // quantity of properties
      var splineData = []; // spline data
      for (let counter = 0; counter < splinePropertiesQuantity; counter++) {
        var arrayValues = [];
        var sumProp = 0;
        arrayNewCleaned.forEach(function(item) {
          let key = Object.keys(item)[counter];
          let value = Object.values(item)[counter];
          var floatValue = 0;
          if (key !== "field_proj_financiering" && key !== "nid") {
            let propValue = value;
            if (propValue === "") {
              floatValue = 0;
            } else {
              floatValue = parseFloat(value);
            }
            arrayValues.push(floatValue);
          }
        });
        if (arrayValues.length > 0) {
          sumProp = arrayValues.reduce(function(sum, item) {
            return sum + item;
          }, 0);
          splineData.push(sumProp);
        }
      }
      return splineData;
    },

    // table headers
    tableHeader(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_fin_color"
      ]);
      var singleFinancering = arrayNewCleaned[0];
      var tableHeaders = [];
      Object.entries(singleFinancering).forEach(([key]) => {
        let title = key;
        if (title === "nid") {
          tableHeaders.push("ID");
        }
        if (title === "field_proj_financiering") {
          tableHeaders.push("Financiering");
        }
        if (title !== "field_proj_financiering" && title !== "nid") {
          let year = title.slice(-4);
          tableHeaders.push(year);
        }
      });
      return tableHeaders;
    },

    // table data
    tableData(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_fin_color"
      ]);
      return arrayNewCleaned;
    },

    // charts and table building
    async buildChart() {
      this.dataLoadingStatus = true;
      // FIN
      var budgetURL = "json/finance.json";
      const response = await fetch(budgetURL);
      if (response.ok) {
        let dataJson = await response.json();
        let financeringArray = _.cloneDeep(dataJson);
        var financeringArrayNotEmpty = this.removeArrayEmptyProperties(
          financeringArray
        );
        // column chart options
        var chartOptions = {
          title: {
            text: "Budget onderzoeksprojecten"
          },
          xAxis: {
            categories: this.columnChartCategories(financeringArrayNotEmpty)
          },
          yAxis: {
            min: 0,
            title: {
              text: "Total budget"
            },
            labels: {
              formatter: function() {
                return "€ " + Highcharts.numberFormat(this.value, 2);
              }
            },
            stackLabels: {
              enabled: false,
              style: {
                fontWeight: "bold",
                color:
                  // theme
                  (Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color) ||
                  "gray"
              }
            }
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            // x: -30,
            // y: 25,
            // floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || "white",
            borderColor: "#CCC",
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: "<b>{point.x}</b><br/>",
            pointFormat: "{series.name}: {point.y}"
          },
          plotOptions: {
            column: {
              stacking: "normal",
              dataLabels: {
                enabled: false
              }
            },
            line: {
              lineWidth: 2,
              color: "#88021a",
              dashStyle: "dash",
              marker: {
                enabled: false,
                lineWidth: 2,
                lineColor: "#88021a",
                fillColor: "#ffffff",
                radius: 2
              }
            }
          },
          series: this.columnChartSeries(financeringArrayNotEmpty)
        };
        // spline chart
        var spline = {
          type: "line",
          name: "Total",
          data: this.splineChartData(financeringArrayNotEmpty)
        };
        chartOptions.series.push(spline); // add spline chart to column chart
        // result object to return
        var result = {};
        result.tableHeader = this.tableHeader(financeringArrayNotEmpty);
        result.tableData = this.tableData(financeringArrayNotEmpty);
        result.tableSums = this.splineChartData(financeringArrayNotEmpty);
        result.chartOptions = chartOptions;
        this.chart = result;
      } else {
        alert("Error HTTP: " + response.status);
      }
      this.dataLoadingStatus = false;
    }
  },
  mounted() {
    this.buildChart();
  }
};
</script>
