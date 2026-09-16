"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionOrigins = exports.env = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
const productionOrigins = [
    'https://www.synapseengineering.dev',
    'https://synapseengineering.dev',
];
exports.productionOrigins = productionOrigins;
function getAllowedOrigins(configuredOrigins = '') {
    return [...new Set([
            ...productionOrigins,
            ...configuredOrigins.split(',').map((origin) => origin.trim()),
        ].filter(Boolean))];
}
const env = {
    port: Number(process.env['PORT']) || 3000,
    isVercel: Boolean(process.env['VERCEL']),
    hasConfiguredOrigins: Boolean(process.env['ALLOWED_ORIGINS']?.trim()),
    allowedOrigins: getAllowedOrigins(process.env['ALLOWED_ORIGINS']),
};
exports.env = env;
