<template>
  <div>
    <div class="text-h3 q-mt-lg text-center text-grey-8 text-weight-light">
      Research Groups
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
  name: "ResearchGroups",
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
      // removing empty keys and properties in financerings array
      if (removingKeys.length > 0) {
        array.forEach(function(itemFin) {
          removingKeys.forEach(function(itemKey) {
            delete itemFin[itemKey];
          });
        });
      }
      return array;
    },

    // remove array selected properties
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
            key !== "field_proj_resgroup" &&
            key !== "field_rg_color" &&
            key !== "field_resgroup_abbreviation"
          ) {
            data.push(parseFloat(value));
          }
          if (key === "field_resgroup_abbreviation") {
            name = value;
          }
          financeringObj.name = name;
          financeringObj.data = data;
          financeringObj.type = "column";
          financeringObj.yAxis = 0;
        }
        financeringObj.color = item.field_rg_color;
        chartSeries.push(financeringObj);
      });
      return chartSeries;
    },

    // column chart categories
    columnChartCategories(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayCleaned = this.removeArrayProperties(arrayNew, [
        "nid",
        "field_proj_resgroup",
        "field_rg_color",
        "field_resgroup_abbreviation"
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
        "field_rg_color",
        "field_resgroup_abbreviation"
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
          if (key !== "field_proj_resgroup" && key !== "nid") {
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

    // spline chart data
    splineChartCalcGroups(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_rg_color",
        "field_resgroup_abbreviation"
      ]);
      var singleObjArrayCleaned = arrayNewCleaned[0];
      var singleObjArrayCleanedKeys = Object.keys(singleObjArrayCleaned);
      var splinePropertiesQuantity = singleObjArrayCleanedKeys.length; // quantity of properties
      var splineData = []; // spline data
      for (let counter = 0; counter < splinePropertiesQuantity; counter++) {
        var arrayValues = [];
        // var sumProp = 0;
        arrayNewCleaned.forEach(function(item) {
          let key = Object.keys(item)[counter];
          let value = Object.values(item)[counter];
          var floatValue = 0;
          if (key !== "field_proj_resgroup" && key !== "nid") {
            let propValue = value;
            if (propValue === "") {
              floatValue = 0;
            } else {
              floatValue = parseFloat(value);
            }
            if (floatValue !== 0) {
              arrayValues.push(floatValue);
            }
          }
        });
        if (arrayValues.length > 0) {
          // sumProp = arrayValues.reduce(function(sum, item) {
          //   return sum + item;
          // }, 0);
          splineData.push(arrayValues.length);
        }
      }
      return splineData;
    },

    // poa spline chart data
    splinePoaChartCalcGroups(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_poa_color",
        "field_poagroup_abbreviation"
      ]);
      var singleObjArrayCleaned = arrayNewCleaned[0];
      var singleObjArrayCleanedKeys = Object.keys(singleObjArrayCleaned);
      var splinePropertiesQuantity = singleObjArrayCleanedKeys.length; // quantity of properties
      var splineData = []; // spline data
      for (let counter = 0; counter < splinePropertiesQuantity; counter++) {
        var arrayValues = [];
        // var sumProp = 0;
        arrayNewCleaned.forEach(function(item) {
          let key = Object.keys(item)[counter];
          let value = Object.values(item)[counter];
          var floatValue = 0;
          if (key !== "field_proj_poagroup" && key !== "nid") {
            let propValue = value;
            if (propValue === "") {
              floatValue = 0;
            } else {
              floatValue = parseFloat(value);
            }
            if (floatValue !== 0) {
              arrayValues.push(floatValue);
            }
          }
        });
        if (arrayValues.length > 0) {
          // sumProp = arrayValues.reduce(function(sum, item) {
          //   return sum + item;
          // }, 0);
          splineData.push(arrayValues.length);
        }
      }
      return splineData;
    },

    // table headers
    tableHeader(array) {
      let arrayNew = _.cloneDeep(array);
      let arrayNewCleaned = this.removeArrayProperties(arrayNew, [
        "field_rg_color",
        "field_resgroup_abbreviation"
      ]);
      var singleFinancering = arrayNewCleaned[0];
      var tableHeaders = [];
      Object.entries(singleFinancering).forEach(([key]) => {
        let title = key;
        if (title === "nid") {
          tableHeaders.push("ID");
        }
        if (title === "field_proj_resgroup") {
          tableHeaders.push("Research group");
        }
        if (title !== "field_proj_resgroup" && title !== "nid") {
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
        "field_rg_color",
        "field_resgroup_abbreviation"
      ]);
      return arrayNewCleaned;
    },

    // charts and table building
    async buildChart() {
      this.dataLoadingStatus = true;
      // POA
      var poaURL = "json/poagroup.json";
      // RG
      var rgURL = "json/rg.json";
      const response = await fetch(rgURL);
      const poaResponse = await fetch(poaURL); // PoA spline data
      if (response.ok) {
        let dataJson = await response.json();
        let financeringArray = _.cloneDeep(dataJson);
        var financeringArrayNotEmpty = this.removeArrayEmptyProperties(
          financeringArray
        );
        // PoA spline
        let poaDataJson = await poaResponse.json();
        let poaFnanceringArray = _.cloneDeep(poaDataJson);
        var poaFinanceringArrayNotEmpty = this.removeArrayEmptyProperties(
          poaFnanceringArray
        );
        // column chart options
        var chartOptions = {
          title: {
            text: "Diversiteit"
          },
          xAxis: {
            categories: this.columnChartCategories(financeringArrayNotEmpty)
          },
          yAxis: [
            {
              // left yAxis
              min: 0,
              title: {
                text: ""
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
            {
              // right yAxis
              title: {
                text: "",
                style: {
                  color: "#88021a"
                }
              },
              labels: {
                format: "{value}",
                style: {
                  color: "#88021a"
                }
              },
              opposite: true
            }
          ],
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
              lineWidth: 2
              // dashStyle: "dash",
            }
          },
          series: this.columnChartSeries(financeringArrayNotEmpty)
        };
        // spline chart
        var spline = {
          color: "#88021a",
          yAxis: 1,
          type: "line",
          name: "Research groups",
          data: this.splineChartCalcGroups(financeringArrayNotEmpty),
          marker: {
            enabled: false,
            lineWidth: 2,
            lineColor: "#88021a",
            fillColor: "#ffffff",
            radius: 2
          }
        };
        chartOptions.series.push(spline); // add spline chart to column chart
        // poa spline chart
        var poaSpline = {
          color: "#1192d1",
          yAxis: 1,
          type: "line",
          name: "PoA groups",
          data: this.splinePoaChartCalcGroups(poaFinanceringArrayNotEmpty),
          marker: {
            enabled: false,
            lineWidth: 2,
            lineColor: "#1192d1",
            fillColor: "#ffffff",
            radius: 2
          }
        };
        chartOptions.series.push(poaSpline); // add PoA spline chart to column chart
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
