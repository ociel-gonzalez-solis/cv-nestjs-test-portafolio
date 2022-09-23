"use strict";
exports.__esModule = true;
exports.SerializeInterceptor = exports.Serialize = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var class_transformer_1 = require("class-transformer");
function Serialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
exports.Serialize = Serialize;
var SerializeInterceptor = /** @class */ (function () {
    function SerializeInterceptor(dto) {
        this.dto = dto;
    }
    SerializeInterceptor.prototype.intercept = function (context, handler) {
        var _this = this;
        return handler.handle().pipe((0, operators_1.map)(function (data) {
            return (0, class_transformer_1.plainToInstance)(_this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    };
    return SerializeInterceptor;
}());
exports.SerializeInterceptor = SerializeInterceptor;
