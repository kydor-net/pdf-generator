"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateTotalPrice(details) {
    return details.reduce((total, detail) => total + detail.price, 0);
}
exports.default = calculateTotalPrice;
