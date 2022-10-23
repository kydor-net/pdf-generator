"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var uploadToS3_1 = require("./helpers/uploadToS3");
var puppeteer = require("puppeteer-core");
var Mustache = require("mustache");
var moment = require("moment");
var calculateTotal_1 = require("./helpers/calculateTotal");
var generateDocument = function (documentType, transaction, awsConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionData_1;
    return __generator(this, function (_a) {
        try {
            // Check if the documentType is valid
            (!fs.existsSync("./lib/templates/".concat(documentType, "/index.html"))) ? (function () { throw new Error('Template not found'); }()) : null;
            transactionData_1 = transaction;
            //
            // Verify if the workshop logo exists and if not, use the default one
            if (!transactionData_1.workshop.logo_url) {
                transactionData_1.workshop.logo_url =
                    'https://mitallerapp-documents.s3.us-west-1.amazonaws.com/logos/mitaller-logo.png';
            }
            ;
            //
            // Read the index.html template and fill it with the provided transaction data
            fs.readFile("./lib/templates/".concat(documentType, "/index.html"), function (err, fileBuffer) { return __awaiter(void 0, void 0, void 0, function () {
                var totalPrice, browser, page, htmlTemplate, formatedHTML;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                throw new Error(err.message);
                            }
                            totalPrice = (0, calculateTotal_1.default)(transactionData_1.details);
                            return [4 /*yield*/, puppeteer.launch({ headless: true })];
                        case 1:
                            browser = _a.sent();
                            return [4 /*yield*/, browser.newPage()];
                        case 2:
                            page = _a.sent();
                            htmlTemplate = fileBuffer.toString();
                            formatedHTML = Mustache.render(htmlTemplate, __assign({ date: moment().format('D/MM/YYYY'), totalPrice: totalPrice }, transactionData_1));
                            return [4 /*yield*/, page.setContent(formatedHTML)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, page.addStyleTag({ path: "./lib/templates/".concat(documentType, "/styles.css") })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, page.pdf({
                                    format: 'A4',
                                    printBackground: false,
                                    margin: {
                                        top: '1px',
                                        bottom: '1px',
                                        left: '1px',
                                        right: '1px',
                                    },
                                }).then(function (pdf) { return __awaiter(void 0, void 0, void 0, function () {
                                    var fileUrl;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, uploadToS3_1.uploadToS3)(pdf, transaction.id, documentType, awsConfig)];
                                            case 1:
                                                fileUrl = _a.sent();
                                                return [4 /*yield*/, browser.close()];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, { ok: true, error: null, documentUrl: fileUrl }];
                                        }
                                    });
                                }); })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            //
            throw new Error('Error generating PDF');
        }
        catch (error) {
            return [2 /*return*/, { ok: false, error: error, documentUrl: null }];
        }
        return [2 /*return*/];
    });
}); };
exports.default = generateDocument;
