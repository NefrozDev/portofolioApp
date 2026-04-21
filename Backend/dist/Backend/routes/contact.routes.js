"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = require("express");
const contactRouter = (0, express_1.Router)();
exports.contactRouter = contactRouter;
contactRouter.post('/', (req, res) => {
    const payload = req.body;
    if (!payload.name || !payload.email || !payload.message) {
        console.warn('Invalid contact request payload received.');
        res.status(400).json({
            message: 'Invalid payload.',
        });
        return;
    }
    res.status(200).json({
        message: 'Message received successfully.',
    });
});
