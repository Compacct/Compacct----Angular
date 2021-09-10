 TutoSupportQueryComponent.prototype.UpdateTicketStatus = function (valid) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var SupportStatusObj, ErrFlagIfTutoApiCall, apiObj, apiRes, error_3, TempObj, obj;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.UpdateStatusFormSubmit = true;
                        if (!valid) return [3 /*break*/, 5];
                        SupportStatusObj = this.SupportStatusList.filter(function (e) { return e.Support_Status_ID == _this.ObjUpdateStatus.Support_Status_ID; })[0];
                        ErrFlagIfTutoApiCall = true;
                        if (!(SupportStatusObj.Is_Closed === 'Y')) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        apiObj = {
                            "contact_id": this.ObjUpdateStatus.Contact_ID,
                            "response": this.ObjUpdateStatus.Followup_Remarks,
                            "status": "Closed",
                            "associate_name": this.$CompacctAPI.CompacctCookies.Name,
                            "associate_id": this.$CompacctAPI.CompacctCookies.User_Name
                        };
                        return [4 /*yield*/, this.CallTutopiaApiForTicket('contact/response', apiObj)];
                    case 2:
                        apiRes = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        ErrFlagIfTutoApiCall = false;
                        return [3 /*break*/, 4];
                    case 4:
                        if (ErrFlagIfTutoApiCall) {
                            TempObj = {
                                Support_ID: this.ObjUpdateStatus.Support_ID,
                                Support_Status_ID: this.ObjUpdateStatus.Support_Status_ID,
                                Asigned_To: this.ObjUpdateStatus.From_Create ? this.$CompacctAPI.CompacctCookies.User_ID : this.ObjUpdateStatus.Asigned_To,
                                Followup_Remarks: this.ObjUpdateStatus.Followup_Remarks
                            };
                            console.log(TempObj);
                            obj = {
                                "Report_Name": "Update_Support_Ticket",
                                "Json_Param_String": JSON.stringify([TempObj])
                            };
                            this.GlobalAPI.CommonTaskData(obj).subscribe(function (data) {
                                console.log(data);
                                if (data[0].Remarks) {
                                    _this.compacctToast.clear();
                                    _this.compacctToast.add({
                                        key: "compacct-toast",
                                        severity: "success",
                                        summary: "Ticket ID : " + _this.ObjUpdateStatus.Support_ID,
                                        detail: "Succesfully Status Updated"
                                    });
                                    _this.UpdateStatusFormSubmit = false;
                                    _this.ObjUpdateStatus = {};
                                    _this.UpdateStatusModalFlag = false;
                                    _this.GetSupportTicketList(true);
                                    if (_this.PrevPendingTicketList.length) {
                                        _this.GetPrevPendingTickets();
                                    }
                                }
                                else {
                                    _this.compacctToast.clear();
                                    _this.compacctToast.add({
                                        key: "compacct-toast",
                                        severity: "error",
                                        summary: "Warn Message",
                                        detail: "Error Occured "
                                    });
                                }
                            });
                        }
                        else {
                            this.compacctToast.clear();
                            this.compacctToast.add({
                                key: "compacct-toast",
                                severity: "error",
                                summary: "Warn Message",
                                detail: "Error From TUTOPIA App API. "
                            });
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // UPLOAD FILE
    TutoSupportQueryComponent.prototype.FetchPDFFile = function (event) {
        // this.PDFFlag = false;
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            this.MultipleFile.push(file);
        }
    };
    // EXPORT TO EXCEL
    TutoSupportQueryComponent.prototype.exportexcel = function (Arr, fileName) {
        var worksheet = xlsx__WEBPACK_IMPORTED_MODULE_10__["utils"].json_to_sheet(Arr);
        var workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        xlsx__WEBPACK_IMPORTED_MODULE_10__["writeFile"](workbook, fileName + '.xlsx');
    };
    // CLEAR SUPPORT
    TutoSupportQueryComponent.prototype.ClearSupportTicket = function () {
        this.seachSpinnersave = false;
        this.ObjTicket = new Ticket();
        this.CreateTicketFormSubmitted = false;
        this.UnIdentifyStudent = false;
        this.TicketWithContactID = false;
        this.SalesDetailsList = [];
        this.PrevTicketList = [];
        this.PrevPendingTicketList = [];
    };
    TutoSupportQueryComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _shared_compacct_services_compacct_global_api_service__WEBPACK_IMPORTED_MODULE_6__["CompacctGlobalApiService"] },
        { type: _shared_compacct_services_common_header_service__WEBPACK_IMPORTED_MODULE_4__["CompacctHeader"] },
        { type: primeng_api__WEBPACK_IMPORTED_MODULE_3__["MessageService"] },
        { type: _shared_compacct_services_common_api_service__WEBPACK_IMPORTED_MODULE_5__["CompacctCommonApi"] },
        { type: _shared_compacct_global_dateTime_service__WEBPACK_IMPORTED_MODULE_7__["DateTimeConvertService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])("fileInput", { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", primeng_primeng__WEBPACK_IMPORTED_MODULE_9__["FileUpload"])
    ], TutoSupportQueryComponent.prototype, "fileUpload", void 0);
    TutoSupportQueryComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-tuto-support-query',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./tuto-support-query.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/admin/common/CRM/Master/tuto-support-query/tuto-support-query.component.html")).default,
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_3__["MessageService"]],
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewEncapsulation"].None,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./tuto-support-query.component.css */ "./src/app/admin/common/CRM/Master/tuto-support-query/tuto-support-query.component.css")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _shared_compacct_services_compacct_global_api_service__WEBPACK_IMPORTED_MODULE_6__["CompacctGlobalApiService"],
            _shared_compacct_services_common_header_service__WEBPACK_IMPORTED_MODULE_4__["CompacctHeader"],
            primeng_api__WEBPACK_IMPORTED_MODULE_3__["MessageService"],
            _shared_compacct_services_common_api_service__WEBPACK_IMPORTED_MODULE_5__["CompacctCommonApi"],
            _shared_compacct_global_dateTime_service__WEBPACK_IMPORTED_MODULE_7__["DateTimeConvertService"]])
    ], TutoSupportQueryComponent);
    return TutoSupportQueryComponent;
}());

var answer = /** @class */ (function () {
    function answer() {
    }
    return answer;
}());
var Search = /** @class */ (function () {
    function Search() {
    }
    return Search;
}());
var Followup = /** @class */ (function () {
    function Followup() {
    }
    return Followup;
}());
var SearchTicket = /** @class */ (function () {
    function SearchTicket() {
    }
    return SearchTicket;
}());
var Ticket = /** @class */ (function () {
    function Ticket() {
        this.Contact_ID = 0;
    }
    return Ticket;
}());
var SearchContactMgs = /** @class */ (function () {
    function SearchContactMgs() {
    }
    return SearchContactMgs;
}());


/***/ }),

/***/ "./src/app/admin/common/CRM/Report/bulk-sms-nepal/bulk-sms-nepal.component.css":
/*!*************************************************************************************!*\
  !*** ./src/app/admin/common/CRM/Report/bulk-sms-nepal/bulk-sms-nepal.component.css ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".custombutton {\r\n  margin-top: 25px;\r\n}\r\n.box-body {\r\n  padding-top: 10px !important;\r\n  padding-left: 10px !important;\r\n}\r\n.ui-progressbar-label {\r\n  color: #040404 !important;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vY29tbW9uL0NSTS9SZXBvcnQvYnVsay1zbXMtbmVwYWwvYnVsay1zbXMtbmVwYWwuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0UsNEJBQTRCO0VBQzVCLDZCQUE2QjtBQUMvQjtBQUNBO0VBQ0UseUJBQXlCO0FBQzNCIiwiZmlsZSI6InNyYy9hcHAvYWRtaW4vY29tbW9uL0NSTS9SZXBvcnQvYnVsay1zbXMtbmVwYWwvYnVsay1zbXMtbmVwYWwuY29tcG9uZW50LmNzc