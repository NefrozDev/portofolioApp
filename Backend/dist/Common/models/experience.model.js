"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTechnologyTag = formatTechnologyTag;
function formatTechnologyTag(technology) {
    return technology.version
        ? `${technology.name} ${technology.version}`
        : technology.name;
}
