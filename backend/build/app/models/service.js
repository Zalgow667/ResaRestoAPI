var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Restaurant from './restaurant.js';
export default class Service extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Service.prototype, "id_service", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Service.prototype, "id_restaurant", void 0);
__decorate([
    belongsTo(() => Restaurant, {
        foreignKey: 'id_restaurant',
    }),
    __metadata("design:type", Object)
], Service.prototype, "restaurant", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Service.prototype, "start", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Service.prototype, "end", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Service.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Service.prototype, "day", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Service.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Service.prototype, "updatedAt", void 0);
//# sourceMappingURL=service.js.map