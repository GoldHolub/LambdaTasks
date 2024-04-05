import { countDeadline } from '../../service/DeadlineCalculatorService';

jest.mock('../../service/EditingTimeCalculationServices/EditingTimeCalculationServiceEN.js', () => ({
  countEditingTimeEN: jest.fn().mockReturnValue(5),
}));
jest.mock('../../service/EditingTimeCalculationServices/EditingTimeCalculationServiceUA.js', () => ({
  countEditingTimeUA: jest.fn().mockReturnValue(5),
}));

describe('countDeadline', () => {
  test('test_countDeadline', () => {
    const result = countDeadline('en', 'txt', 1000);
    expect(result).toHaveProperty('editingTime');
    expect(result).toHaveProperty('deadlineTimestamp');
    expect(result).toHaveProperty('formattedDeadlineDate');
  });

  test('test_countDeadline_unsupportedLanguage', () => {
    expect(() => {
      countDeadline('fr', 'txt', 1000);
    }).toThrow('Unsupported language');
  });

  test('test_countDeadline_workingHours', () => {
    const fixedTimestamp = new Date('2023-04-01T11:00:00Z').getTime();
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => fixedTimestamp);

    const result = countDeadline('en', 'txt', 1);
    const expectedDeadlineHour = new Date(result.deadlineTimestamp * 1000).getHours();
    expect(expectedDeadlineHour).toBeGreaterThanOrEqual(10);
    expect(expectedDeadlineHour).toBeLessThan(19);
  });
});