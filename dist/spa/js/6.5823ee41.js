(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{ad43:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"text-h3 q-mt-lg text-center text-grey-8 text-weight-light"},[e._v("\n    PoA Groups\n  ")]),a("div",{staticClass:"q-pa-lg"},[a("div",{staticClass:"q-mt-md q-mb-md"},[a("q-btn-group",[a("q-btn",{attrs:{color:"red",icon:"cached",label:"update"},on:{click:function(t){return e.buildChart()}}})],1),e.dataLoadingStatus?a("q-spinner-ios",{staticClass:"q-ml-md q-mr-md",attrs:{color:"light-blue",size:"2em"}}):e._e()],1),e.chart.chartOptions?a("div",{staticClass:"q-mb-lg"},[a("q-card",[a("q-card-section",[a("div",{staticClass:"q-pa-md"},[a("highcharts",{attrs:{options:e.chart.chartOptions}})],1)])],1)],1):e._e(),a("div",{staticClass:"q-mb-lg"},[e.chart?a("q-markup-table",[a("thead",[a("tr",e._l(e.chart.tableHeader,(function(t){return a("th",{key:t,staticClass:"text-left"},[e._v("\n              "+e._s(t)+"\n            ")])})),0)]),a("tbody",[e._l(e.chart.tableData,(function(t){return a("tr",{key:t.nid},e._l(t,(function(t,r){return a("td",{key:r,staticClass:"text-left"},[e._v("\n              "+e._s(t)+"\n            ")])})),0)})),a("tr",[a("td"),a("td"),e._l(e.chart.tableSums,(function(t){return a("td",{key:t,staticClass:"text-right"},[a("strong",[e._v(e._s(t.toFixed(2)))])])}))],2)],2)]):e._e()],1)])])},o=[],l=(a("13d5"),a("fb6a"),a("e6cf"),a("ddb0"),a("2b0e")),i=a("4452"),n=a("ea7f"),s=a.n(n),c=a("0319"),p=a.n(c),d=a("9955"),u=a.n(d),h=a("2ef0"),f=a.n(h);l["a"].use(i["Chart"]),p()(s.a);const b=a("2ef0");l["a"].use(u.a,{name:"cloneDeep",lodash:{cloneDeep:f.a}});var _={name:"PoaGroups",components:{highcharts:i["Chart"]},data(){return{leftDrawerOpen:!0,dataLoadingStatus:!1,chart:!1}},methods:{removeArrayEmptyProperties(e){var t=e.length,a=Object.keys(e[0]).length,r=[];for(let o=0;o<a;o++){let a=0;e.forEach((function(e){let l=Object.keys(e)[o],i=e[l];""===i&&(a+=1,a==t&&r.push(l))}))}return r.length>0&&e.forEach((function(e){r.forEach((function(t){delete e[t]}))})),e},removeArrayProperties(e,t){var a=b.cloneDeep(e);return a.forEach((e=>{t.forEach((t=>{let a=t;delete e[a]}))})),a},columnChartSeries(e){let t=b.cloneDeep(e);var a=[];return t.forEach((function(e){var t={},r=[],o="";for(let[a,l]of Object.entries(e))"nid"!==a&&"field_proj_poagroup"!==a&&"field_poa_color"!==a&&"field_poagroup_abbreviation"!==a&&r.push(parseFloat(l)),"field_poagroup_abbreviation"===a&&(o=l),t.name=o,t.data=r,t.type="column",t.yAxis=0;t.color=e.field_poa_color,a.push(t)})),a},columnChartCategories(e){let t=b.cloneDeep(e),a=this.removeArrayProperties(t,["nid","field_proj_poagroup","field_poa_color","field_poagroup_abbreviation"]);var r=[];for(let o of Object.keys(a[0])){let e=o.slice(-4);r.push(e)}return r},splineChartData(e){let t=b.cloneDeep(e),a=this.removeArrayProperties(t,["field_poa_color","field_poagroup_abbreviation"]);var r=a[0],o=Object.keys(r),l=o.length,i=[];for(let c=0;c<l;c++){var n=[],s=0;a.forEach((function(e){let t=Object.keys(e)[c],a=Object.values(e)[c];var r=0;if("field_proj_poagroup"!==t&&"nid"!==t){let e=a;r=""===e?0:parseFloat(a),n.push(r)}})),n.length>0&&(s=n.reduce((function(e,t){return e+t}),0),i.push(s))}return i},splineChartCalcGroups(e){let t=b.cloneDeep(e),a=this.removeArrayProperties(t,["field_poa_color","field_poagroup_abbreviation"]);var r=a[0],o=Object.keys(r),l=o.length,i=[];for(let s=0;s<l;s++){var n=[];a.forEach((function(e){let t=Object.keys(e)[s],a=Object.values(e)[s];var r=0;if("field_proj_poagroup"!==t&&"nid"!==t){let e=a;r=""===e?0:parseFloat(a),0!==r&&n.push(r)}})),n.length>0&&i.push(n.length)}return i},tableHeader(e){let t=b.cloneDeep(e),a=this.removeArrayProperties(t,["field_poa_color","field_poagroup_abbreviation"]);var r=a[0],o=[];return Object.entries(r).forEach((([e])=>{let t=e;if("nid"===t&&o.push("ID"),"field_proj_poagroup"===t&&o.push("Research group"),"field_proj_poagroup"!==t&&"nid"!==t){let e=t.slice(-4);o.push(e)}})),o},tableData(e){let t=b.cloneDeep(e),a=this.removeArrayProperties(t,["field_poa_color","field_poagroup_abbreviation"]);return a},async buildChart(){this.dataLoadingStatus=!0;var e="json/poagroup.json";const t=await fetch(e);if(t.ok){let e=await t.json(),i=b.cloneDeep(e);var a=this.removeArrayEmptyProperties(i),r={title:{text:"Diversiteit"},xAxis:{categories:this.columnChartCategories(a)},yAxis:[{min:0,title:{text:""},labels:{formatter:function(){return"€ "+s.a.numberFormat(this.value,2)}},stackLabels:{enabled:!1,style:{fontWeight:"bold",color:s.a.defaultOptions.title.style&&s.a.defaultOptions.title.style.color||"gray"}}},{title:{text:"",style:{color:"#88021a"}},labels:{format:"{value}",style:{color:"#88021a"}},opposite:!0}],legend:{layout:"vertical",align:"right",verticalAlign:"middle",backgroundColor:s.a.defaultOptions.legend.backgroundColor||"white",borderColor:"#CCC",borderWidth:1,shadow:!1},tooltip:{headerFormat:"<b>{point.x}</b><br/>",pointFormat:"{series.name}: {point.y}"},plotOptions:{column:{stacking:"normal",dataLabels:{enabled:!1}},line:{lineWidth:2,color:"red",marker:{enabled:!1,lineWidth:2,lineColor:"red",fillColor:"#ffffff",radius:2}}},series:this.columnChartSeries(a)},o={yAxis:1,type:"line",name:"PoA groups",data:this.splineChartCalcGroups(a)};r.series.push(o);var l={};l.tableHeader=this.tableHeader(a),l.tableData=this.tableData(a),l.tableSums=this.splineChartData(a),l.chartOptions=r,this.chart=l}else alert("Error HTTP: "+t.status);this.dataLoadingStatus=!1}},mounted(){this.buildChart()}},g=_,m=a("2877"),v=a("e7a9"),y=a("9c40"),C=a("d9b2"),k=a("f09f"),j=a("a370"),O=a("2bb1"),D=a("eebe"),x=a.n(D),q=Object(m["a"])(g,r,o,!1,null,null,null);t["default"]=q.exports;x()(q,"components",{QBtnGroup:v["a"],QBtn:y["a"],QSpinnerIos:C["a"],QCard:k["a"],QCardSection:j["a"],QMarkupTable:O["a"]})}}]);