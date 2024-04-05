import { createCostCalculationService } from "../../service/CostCalculationService";
describe('Cost Calculation Service', () => {
    it('should return an object with a method calculateCostOfTranslation', () => {
      const service = createCostCalculationService('en');
      expect(service).toBeDefined();
      expect(service.calculateCostOfEditing).toBeDefined();
      expect(typeof service.calculateCostOfEditing).toBe('function');
    });

    it('should throw an error for an empty language parameter', () => {
      expect(() => {
        createCostCalculationService('').calculateCostOfEditing('doc', '100');
      }).toThrow('Unsupported language');
    });
});
