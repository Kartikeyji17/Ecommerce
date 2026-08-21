const { buildOrderFromItems, SHIPPING_RATES, TAX_RATE } = require("../utils/orderPricing");

describe("orderPricing", () => {
  it("calculates shipping and tax correctly", () => {
    expect(SHIPPING_RATES.standard(30)).toBe(9.99);
    expect(SHIPPING_RATES.standard(60)).toBe(0);
    expect(SHIPPING_RATES.express()).toBe(29.99);
    expect(TAX_RATE).toBe(0.1);
  });
});
