(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"713b":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-layout",{attrs:{view:"hHh Lpr lff"}},[n("q-header",{attrs:{elevated:""}},[n("q-toolbar",[n("q-btn",{attrs:{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu"},on:{click:function(t){e.leftDrawerOpen=!e.leftDrawerOpen}}}),n("q-toolbar-title",[e._v("\n        PoA Charts\n      ")]),n("div",[e._v("Single Page App")])],1)],1),n("q-drawer",{attrs:{bordered:"","content-class":"bg-grey-1"},model:{value:e.leftDrawerOpen,callback:function(t){e.leftDrawerOpen=t},expression:"leftDrawerOpen"}},[n("q-list",[n("q-item-label",{staticClass:"text-grey-8",attrs:{header:""}},[e._v("\n        Essential Links\n      ")]),e._l(e.essentialLinks,(function(t){return n("EssentialLink",e._b({key:t.title},"EssentialLink",t,!1))}))],2)],1),n("q-page-container",[n("div",{staticClass:"q-pa-md"},[n("div",{staticClass:"q-mb-md"},[n("q-btn",{attrs:{color:"primary",label:"Get data"},on:{click:function(t){return e.financeringGetData()}}})],1),e.financeringData?n("q-markup-table",[n("thead",[n("tr",e._l(e.financeringComputed.tableHeader,(function(t){return n("th",{key:t,staticClass:"text-left"},[e._v("\n              "+e._s(t)+"\n            ")])})),0)]),n("tbody",e._l(e.financeringComputed.tableData,(function(t){return n("tr",{key:t.nid},e._l(t,(function(t,a){return n("td",{key:a,staticClass:"text-left"},[e._v("\n              "+e._s(t)+"\n            ")])})),0)})),0)]):e._e()],1),n("div",{staticClass:"q-pa-md"},[e.financeringComputed.chartOptions?n("highcharts",{attrs:{options:e.financeringComputed.chartOptions}}):e._e()],1)])],1)},i=[],r=(n("fb6a"),n("e6cf"),n("a79d"),n("ddb0"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-item",{attrs:{clickable:"",tag:"a",target:"_blank",href:e.link}},[e.icon?n("q-item-section",{attrs:{avatar:""}},[n("q-icon",{attrs:{name:e.icon}})],1):e._e(),n("q-item-section",[n("q-item-label",[e._v(e._s(e.title))]),n("q-item-label",{attrs:{caption:""}},[e._v("\n      "+e._s(e.caption)+"\n    ")])],1)],1)}),o=[],l={name:"EssentialLink",props:{title:{type:String,required:!0},caption:{type:String,default:""},link:{type:String,default:"#"},icon:{type:String,default:""}}},s=l,c=n("2877"),d=n("66e5"),f=n("4074"),p=n("0016"),u=n("0170"),b=n("eebe"),h=n.n(b),g=Object(c["a"])(s,r,o,!1,null,null,null),m=g.exports;h()(g,"components",{QItem:d["a"],QItemSection:f["a"],QIcon:p["a"],QItemLabel:u["a"]});var v=n("2b0e"),k=n("bc3a"),_=n.n(k),y=n("2106"),O=n.n(y),q=n("4452"),w=n("ea7f"),C=n.n(w),D=n("0319"),L=n.n(D),x=n("9955"),A=n.n(x),E=n("2ef0"),Q=n.n(E);v["a"].use(O.a,_.a),v["a"].use(q["Chart"]),L()(C.a);const j=n("2ef0");v["a"].use(A.a,{name:"cloneDeep",lodash:{cloneDeep:Q.a}});const I=[{title:"Docs",caption:"quasar.dev",icon:"school",link:"https://quasar.dev"}];var T={name:"MainLayout",components:{EssentialLink:m,highcharts:q["Chart"]},data(){return{leftDrawerOpen:!1,essentialLinks:I,financeringData:void 0}},methods:{financeringGetData(){const e="/webcharts/json/finance.json";setTimeout((()=>{_.a.get(e).then((e=>this.financeringData=e.data)).catch((e=>console.log(e))).finally((()=>console.log("done")))}),1e3)}},computed:{financeringComputed:function(){const e=[{name:"PoA: Port of Antwerp",id:"50",color:"#ff0000"},{name:"VLAIO: VLAIO",id:"51",color:"#f39200"},{name:"BOF: UAntwerpen",id:"52",color:"#6c223c"},{name:"PWO: UAntwerpen",id:"53",color:"#454d6b"},{name:"IOF: UAntwerpen",id:"54",color:"#83d0f5"}];var t=j.cloneDeep(this.financeringData);if(t){var n=t.length,a=Object.keys(t[0]).length,i=[];for(let e=0;e<a;e++){var r=0;t.forEach((function(t){let a=Object.keys(t)[e],o=t[a];""===o&&(r+=1,r==n&&i.push(a))}))}i.length>0&&t.forEach((function(e){i.forEach((function(t){delete e[t]}))}));var o=[];t.forEach((function(e){Object.entries(e).forEach((([e,t])=>{var n="";if(n=e,"nid"===n)o.includes("ID")||o.push("ID");else if("field_proj_financiering"===n)o.includes("Financiering")||o.push("Financiering");else{let e=n.slice(-4);o.includes(e)||o.push(e)}}))}));var l={title:{text:"Budget chart"},xAxis:{categories:[]},yAxis:{min:0,title:{text:"Total budget"},stackLabels:{enabled:!0,style:{fontWeight:"bold",color:C.a.defaultOptions.title.style&&C.a.defaultOptions.title.style.color||"gray"}}},legend:{align:"right",x:-30,verticalAlign:"top",y:25,floating:!0,backgroundColor:C.a.defaultOptions.legend.backgroundColor||"white",borderColor:"#CCC",borderWidth:1,shadow:!1},tooltip:{headerFormat:"<b>{point.x}</b><br/>",pointFormat:"{series.name}: {point.y}<br/>Total: {point.stackTotal}"},plotOptions:{column:{stacking:"normal",dataLabels:{enabled:!1}},series:{pointWidth:25}},series:[]},s=[];for(let e of Object.keys(t[0]))if("nid"!==e&&"field_proj_financiering"!==e){let t=e.slice(-4);s.push(t)}var c=[],d={type:"spline",name:"Average",data:[3e5,4e5,25e4,45e4,32e4,21e4,28e4,18e4,51e4,39e4,25e4],marker:{lineWidth:2,lineColor:C.a.getOptions().colors[3],fillColor:"white"}};t.forEach((function(t){var n={},a=[],i="";for(let[e,r]of Object.entries(t))"nid"!==e&&"field_proj_financiering"!==e&&a.push(parseFloat(r)),"field_proj_financiering"===e&&(i=r),n.name=i,n.data=a,n.type="column";e.forEach((function(e){e.id===t.nid&&(n.color=e.color)})),console.log(n.color),c.push(n)})),c.push(d),l.xAxis.categories=s,l.series=c}var f={};return f.tableData=t,f.tableHeader=o,f.chartOptions=l,f}}},F=T,P=n("4d5a"),S=n("e359"),W=n("65c6"),H=n("9c40"),B=n("6ac5"),G=n("9404"),M=n("1c1c"),U=n("09e3"),J=n("2bb1"),V=Object(c["a"])(F,a,i,!1,null,null,null);t["default"]=V.exports;h()(V,"components",{QLayout:P["a"],QHeader:S["a"],QToolbar:W["a"],QBtn:H["a"],QToolbarTitle:B["a"],QDrawer:G["a"],QList:M["a"],QItemLabel:u["a"],QPageContainer:U["a"],QMarkupTable:J["a"]})}}]);