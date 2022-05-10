"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleChoiceSchema = exports.TrueAndFalseSchema = exports.AbstractQuestionSchema = void 0;
var mongoose_1 = require("mongoose");
var AbstractQuestionSchema = new mongoose_1.Schema({
    name: { type: String, minlength: 5, maxlength: 25, required: true },
    type: {
        type: String,
        enum: ['True-False', 'Multiple-Choice'],
        required: true,
    },
}, { discriminatorKey: 'type' });
exports.AbstractQuestionSchema = AbstractQuestionSchema;
var TrueAndFalseSchema = new mongoose_1.Schema({
    correctAnswer: { type: Boolean, required: true },
});
exports.TrueAndFalseSchema = TrueAndFalseSchema;
var MultipleChoiceSchema = new mongoose_1.Schema({
    answers: { type: [String], default: undefined, required: true },
    correctAnswer: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c'],
    },
});
exports.MultipleChoiceSchema = MultipleChoiceSchema;
