<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          PoA Charts
        </q-toolbar-title>

        <div>Single Page App</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- table with data -->
      <div class="q-pa-md">
        <div class="q-mb-md">
          <q-btn
            @click="financeringGetData()"
            color="primary"
            label="Get data"
          />
        </div>
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
          </tbody>
        </q-markup-table>
      </div>
      <!-- highcharts -->
      <div class="q-pa-md">
        <highcharts
          v-if="financeringComputed.chartOptions"
          :options="financeringComputed.chartOptions"
        ></highcharts>
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
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink, highcharts: Chart },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      financeringData: undefined
    };
  },
  methods: {
    financeringGetData() {
      const api = "/webcharts/json/finance.json";
      setTimeout(() => {
        axios
          .get(api)
          .then(response => (this.financeringData = response.data))
          .catch(error => console.log(error))
          .finally(() => console.log("done"));
      }, 1000);
    }
  },
  computed: {
    // financering data prepared for table and charts
    financeringComputed: function() {
      // financering colors
      const financeringColors = [
        { name: "PoA: Port of Antwerp", id: "50", color: "#ff0000" },
        { name: "VLAIO: VLAIO", id: "51", color: "#f39200" },
        { name: "BOF: UAntwerpen", id: "52", color: "#6c223c" },
        { name: "PWO: UAntwerpen", id: "53", color: "#454d6b" },
        { name: "IOF: UAntwerpen", id: "54", color: "#83d0f5" }
      ];
      // creating immutable array
      var financeringArray = _.cloneDeep(this.financeringData);
      if (financeringArray) {
        // quantity of financerings
        var objectsQuantity = financeringArray.length;
        // quantity of properties
        var propertiesQuantity = Object.keys(financeringArray[0]).length;
        // array of titles of empty proprties
        var removingKeys = [];
        // loop for every financering's property
        for (let counter = 0; counter < propertiesQuantity; counter++) {
          // conter of financering with this empty property
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
        // removing empty keys and properties
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
        // chart options
        var chartOptions = {
          // chart: {
          //   type: "column"
          // },
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
            align: "right",
            x: -30,
            verticalAlign: "top",
            y: 25,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || "white",
            borderColor: "#CCC",
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: "<b>{point.x}</b><br/>",
            pointFormat:
              "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
          },
          plotOptions: {
            column: {
              stacking: "normal",
              dataLabels: {
                enabled: false
              }
            },
            // width of columns
            series: {
              pointWidth: 25
            }
          },
          series: []
        };
        // chart dynamic data
        var chartCategories = [];
        // loop through array of financering
        for (let key of Object.keys(financeringArray[0])) {
          if (key !== "nid" && key !== "field_proj_financiering") {
            let year = key.slice(-4);
            chartCategories.push(year);
          }
        }
        var chartSeries = [];
        var spline = {
          type: "spline",
          name: "Average",
          data: [
            300000,
            400000,
            250000,
            450000,
            320000,
            210000,
            280000,
            180000,
            510000,
            390000,
            250000
          ],
          marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: "white"
          }
        };
        // loop for every financering
        financeringArray.forEach(function(item) {
          var financering = {};
          var data = [];
          var name = "";
          // loop through array of financering
          for (let [key, value] of Object.entries(item)) {
            if (key !== "nid" && key !== "field_proj_financiering") {
              data.push(parseFloat(value));
            }
            if (key === "field_proj_financiering") {
              name = value;
            }
            financering.name = name;
            financering.data = data;
            financering.type = "column";
          }
          financeringColors.forEach(function(colorItem) {
            if (colorItem.id === item.nid) {
              financering.color = colorItem.color;
            }
          });
          console.log(financering.color);
          chartSeries.push(financering);
        });
        chartSeries.push(spline);
        // chart categories
        chartOptions.xAxis.categories = chartCategories;
        chartOptions.series = chartSeries;
      }

      // object to return
      var result = {};
      result.tableData = financeringArray;
      result.tableHeader = tableHeader;
      result.chartOptions = chartOptions;
      return result;
    }
  }
};
</script>
