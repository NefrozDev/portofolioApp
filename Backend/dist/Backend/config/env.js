"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env = {
    port: Number(process.env['PORT']) || 3000,
};
exports.env = env;
