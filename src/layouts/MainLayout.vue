<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="bg-white text-grey-8">
        <!-- @click="leftDrawerOpen = !leftDrawerOpen" -->
        <q-btn flat dense round icon="menu" aria-label="Menu" />
        <q-toolbar-title>
          PoA Charts
        </q-toolbar-title>

        <div>
          <q-btn
            type="a"
            href="https://github.com/rmcf/webcharts"
            flat
            round
            dense
            icon="settings"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-1 q-pt-lg"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Available datasets
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="text-h4 q-mt-lg text-center text-grey-8">
        Budget
      </div>
      <div class="q-pa-lg">
        <!-- buttons -->
        <div class="q-mb-md">
          <q-btn
            @click="financeringGetData()"
            icon="download"
            color="red"
            label="load data"
          />
          <q-spinner-ios
            v-if="dataLoadingStatus"
            class="q-ml-md q-mr-md"
            color="light-blue"
            size="2em"
          />
        </div>

        <!-- highcharts -->
        <div v-if="financeringComputed.chartOptions" class="q-mb-lg">
          <q-card>
            <q-card-section>
              <div class="q-pa-md">
                <highcharts
                  :options="financeringComputed.chartOptions"
                ></highcharts>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- table with data -->
        <div class="q-mb-lg">
          <q-markup-table v-if="financeringData">
            <thead>
              <tr>
                <th
                  v-for="title in financeringComputed.tableHeader"
                  :key="title"
                  class="text-left"
                >
                  {{ title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in financeringComputed.tableData" :key="item.nid">
                <td v-for="(value, key) in item" :key="key" class="text-left">
                  {{ value }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td
                  v-for="item in financeringComputed.tableSums"
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
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import Vue from "vue";
// axios
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
// highcharts
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
Vue.use(Chart);
exportingInit(Highcharts);
// lodash
import VueLodash from "vue-lodash";
import cloneDeep from "lodash";
const _ = require("lodash");

Vue.use(VueLodash, { name: "cloneDeep", lodash: { cloneDeep } });

const linksData = [
  {
    title: "Financerings",
    caption: "Budget",
    icon: "euro_symbol",
    link: "https://quasar.dev"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink, highcharts: Chart },
  data() {
    return {
      leftDrawerOpen: true,
      essentialLinks: linksData,
      financeringData: undefined,
      dataLoadingStatus: false
    };
  },
  methods: {
    // receiving data from API
    financeringGetData() {
      this.dataLoadingStatus = true;
      const api = "json/finance.json";
      setTimeout(() => {
        axios
          .get(api)
          .then(response => (this.financeringData = response.data))
          .catch(error => console.log(error))
          .finally(() => (this.dataLoadingStatus = false));
      }, 1000);
    }
  },
  computed: {
    // financering table, chart
    financeringComputed: function() {
      // financering colors
      const financeringColors = [
        { name: "PoA: Port of Antwerp", id: "50", color: "#ff0000" },
        { name: "VLAIO: VLAIO", id: "51", color: "#f39200" },
        { name: "BOF: UAntwerpen", id: "52", color: "#6c223c" },
        { name: "PWO: UAntwerpen", id: "53", color: "#454d6b" },
        { name: "IOF: UAntwerpen", id: "54", color: "#83d0f5" }
      ];
      // immutable array of data
      var financeringArray = _.cloneDeep(this.financeringData);
      if (financeringArray) {
        // quantity of financerings
        var objectsQuantity = financeringArray.length;
        // quantity of properties
        var propertiesQuantity = Object.keys(financeringArray[0]).length;
        // array of keys of empty proprties
        var removingKeys = [];
        // loop for every financering's property
        for (let counter = 0; counter < propertiesQuantity; counter++) {
          // conter of financerings with this empty property
          var counterEmpty = 0;
          // loop for every financering
          financeringArray.forEach(function(item) {
            // key of this property
            let key = Object.keys(item)[counter];
            // value of this property
            let value = item[key];
            // pushing keys of empty properties to array
            if (value === "") {
              counterEmpty = counterEmpty + 1;
              if (counterEmpty == objectsQuantity) {
                removingKeys.push(key);
              }
            }
          });
        }
        // removing empty keys and properties in financerings array
        if (removingKeys.length > 0) {
          financeringArray.forEach(function(itemFin) {
            removingKeys.forEach(function(itemKey) {
              delete itemFin[itemKey];
            });
          });
        }
        // table headers
        var tableHeader = [];
        // loop through array of financering
        financeringArray.forEach(function(item) {
          // loop through every financering
          Object.entries(item).forEach(([key, value]) => {
            var title = "";
            title = key;
            if (title === "nid") {
              if (!tableHeader.includes("ID")) {
                tableHeader.push("ID");
              }
            } else {
              if (title === "field_proj_financiering") {
                if (!tableHeader.includes("Financiering")) {
                  tableHeader.push("Financiering");
                }
              } else {
                let year = title.slice(-4);
                if (!tableHeader.includes(year)) {
                  tableHeader.push(year);
                }
              }
            }
          });
        });
        // column chart options
        var chartOptions = {
          title: {
            text: "Budget chart"
          },
          xAxis: {
            categories: []
          },
          yAxis: {
            min: 0,
            title: {
              text: "Total budget"
            },
            stackLabels: {
              enabled: true,
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
            }
            // // width of columns
            // series: {
            //   pointWidth: 35
            // }
          },
          series: []
        };
        // column chart categories
        var chartCategories = [];
        for (let key of Object.keys(financeringArray[0])) {
          if (key !== "nid" && key !== "field_proj_financiering") {
            let year = key.slice(-4);
            chartCategories.push(year);
          }
        }
        chartOptions.xAxis.categories = chartCategories;
        // column chart series
        var chartSeries = [];
        financeringArray.forEach(function(item) {
          var financeringObj = {};
          var data = [];
          var name = "";
          for (let [key, value] of Object.entries(item)) {
            if (key !== "nid" && key !== "field_proj_financiering") {
              data.push(parseFloat(value));
            }
            if (key === "field_proj_financiering") {
              name = value;
            }
            financeringObj.name = name;
            financeringObj.data = data;
            financeringObj.type = "column";
          }
          financeringColors.forEach(function(colorItem) {
            if (colorItem.id === item.nid) {
              financeringObj.color = colorItem.color;
            }
          });
          chartSeries.push(financeringObj);
        });
        chartOptions.series = chartSeries;
        // spline chart
        var spline = {
          type: "spline",
          name: "Total",
          data: [],
          color: "#03a9f4",
          // dashStyle: "dash",
          marker: {
            lineWidth: 2,
            lineColor: "#03a9f4",
            fillColor: "white"
          }
        };
        // function quantity of not empty properties
        var notEmptyFunction = function(object) {
          var notEmptyCounter = 0;
          for (let key of Object.keys(object)) {
            if (key) {
              notEmptyCounter = notEmptyCounter + 1;
            }
          }
          return notEmptyCounter;
        };
        // counter of not empty properties
        var notEpmtyProperties = notEmptyFunction(financeringArray[0]);
        // creating data for spline
        var splineData = [];
        for (let counter = 2; counter < notEpmtyProperties; counter++) {
          var arrayValues = [];
          var sumProp = 0;
          financeringArray.forEach(function(item) {
            var floatValue = 0;
            if (Object.values(item)[counter]) {
              let propValue = Object.values(item)[counter];
              if (propValue === "") {
                floatValue = 0;
              } else {
                floatValue = parseFloat(Object.values(item)[counter]);
              }
              arrayValues.push(floatValue);
            }
          });
          sumProp = arrayValues.reduce(function(sum, item) {
            return sum + item;
          }, 0);
          splineData.push(sumProp);
        }
        spline.data = splineData;
        // adding spline to column chart
        chartSeries.push(spline);
      }
      // object to return
      var result = {};
      result.tableHeader = tableHeader;
      result.tableData = financeringArray;
      result.tableSums = splineData;
      result.chartOptions = chartOptions;
      return result;
    }
  }
};
</script>
