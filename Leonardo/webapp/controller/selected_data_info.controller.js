var list = [];

function printdata(oEvent, MessageToast) {
	$("#__xmlview1--list1--idThingList-listUl tr").on("click", function () {
		// var tdArr = new Array(); // 배열 선언
		var tr = $(this);
		var td = tr.children();

		// tr.text()는 클릭된 Row 즉 tr에 있는 모든 값을 가져온다.
		// 반복문을 이용해서 배열에 값을 담아 사용할 수 도 있다.

		// td.each(function (i) {
		// 	tdArr.push(td.eq(i).text());
		// });
		// td.eq(index)를 통해 값을 가져올 수도 있다.

		// var data = td.eq(1).text();
		var data = td.eq(1).children().children().eq(1).children();
		var name = data.eq(0).text();
		var addr = data.eq(1).text();

		// str += "현재 데이터: " + data;
		//MessageToast.show("name: " + name + "\naddr: " + addr);
	});
}

function transfer() {
	$("#__xmlview1--list1--idThingList-listUl tr").on("click", function () {
		// var tdArr = new Array(); // 배열 선언
		var tr = $(this);
		var td = tr.children();

		// tr.text()는 클릭된 Row 즉 tr에 있는 모든 값을 가져온다.
		// 반복문을 이용해서 배열에 값을 담아 사용할 수 도 있다.

		// td.each(function (i) {
		// 	tdArr.push(td.eq(i).text());
		// });

		// var data = td.eq(1).text();
		var data = td.eq(1).children().children().eq(1).children();
		var name = data.eq(0).text();
		var addr = data.eq(1).text();
	});
}

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";
	var strid = "";

	return Controller.extend("Leonardo.controller.selected_data_info", {
		onInit: function () {
			var oJSONData = {
				busy: false
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "measuredValueModel");
			$(".sapUiBody tr").click(function (e) {
				var classname = e.target.getAttribute("class");
				var id = e.target.getAttribute("id");
				sap.m.MessageToast.show("class name: " + classname + "\nnow Id: " + id);
			});
			$(window).scroll(function () {
				if ($(window).scrollTop() + $(window).height() === $(document).height()) {
					sap.m.MessageToast.show("bottom!");
				}
			});
		},
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		},
		updateMeasuredValuesRealTime: function () {
			this.refreshInterval = setInterval(function () {
				var mvList = this.byId(strid);
				mvList._extractModelForThingIdReloaded(mvList);
			}.bind(this), 2000); //time in ms
		},
		updateRealTime: function () {
			var oModel = this.getView().getModel();
			setInterval(function () {
				oModel.read("/Things", {
					//Use /Events for loading eventList Control
					urlParameters: {
						"$expand": strid
					}
				});
			}, 10000);
			oModel.refresh();
		},
		press: function (oEvent) {
			var temp = [];
			$("tr[id^=__item][aria-selected=true]").each(function () {
				var str = $(this).find("td").eq(2).text().split(".");
				temp.push(str[1]);
			});
			list = temp;
			MessageToast.show("selected values list: " + list);
		},
		change: function (oEvent) {
			$("#__xmlview1--list1--idThingList-listUl tr").click(function () {
				// var tdArr = new Array(); // 배열 선언
				var tr = $(this);
				var td = tr.children();

				// tr.text()는 클릭된 Row 즉 tr에 있는 모든 값을 가져온다.
				// 반복문을 이용해서 배열에 값을 담아 사용할 수 도 있다.

				// td.each(function (i) {
				// 	tdArr.push(td.eq(i).text());
				// });
				// td.eq(index)를 통해 값을 가져올 수도 있다.

				// var data = td.eq(1).text();
				var data = td.eq(1).children().children().eq(1).children();
				var name = data.eq(0).text();
				var addr = data.eq(1).text();

				// str += "현재 데이터: " + data;
				MessageToast.show("name: " + name + "\naddr: " + addr);
			});
		},
		Ferr: function (oEvent) {
			$("span[id*=__table]").click(function () {
				// var2 = $.inArray($(this).text(), list);
				var var1 = $("span[id*=__table]").text();
				var var2 = $(this).text();
				MessageToast.show("test");
			});
		},
		Perr: function (oEvent) {

		},
		Verr: function (oEvent) {
			MessageToast.show("Verr");
		},
		Vsuc: function (oEvent) {
			MessageToast.show("Vsuc");
		}
	});
});