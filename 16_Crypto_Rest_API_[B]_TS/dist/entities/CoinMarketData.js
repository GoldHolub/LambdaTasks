var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//{ name: "coin_market_data" }
let CoinMarketData = class CoinMarketData {
    id;
    market_name;
    name;
    price;
    saved_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CoinMarketData.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], CoinMarketData.prototype, "market_name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], CoinMarketData.prototype, "name", void 0);
__decorate([
    Column({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], CoinMarketData.prototype, "price", void 0);
__decorate([
    Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CoinMarketData.prototype, "saved_at", void 0);
CoinMarketData = __decorate([
    Entity()
], CoinMarketData);
export { CoinMarketData };
//# sourceMappingURL=CoinMarketData.js.map