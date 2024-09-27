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
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Plan from '#models/plan';
export default class Table extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Table.prototype, "id_table", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Table.prototype, "numero", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Table.prototype, "capacity", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Table.prototype, "id_plan", void 0);
__decorate([
    belongsTo(() => Plan),
    __metadata("design:type", Object)
], Table.prototype, "plan", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Table.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], Table.prototype, "updatedAt", void 0);
//# sourceMappingURL=table.js.map