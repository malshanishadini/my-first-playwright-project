// src/pages/CartPage.ts

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  // Navigation
  async goto() {
    await this.navigate('/cart.html');
  }

  // Cart actions
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItems
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async getCartTotal(): Promise<number> {
    const prices =
      await this.cartItems
        .locator('.inventory_item_price')
        .allTextContents();

    return prices.reduce(
      (sum, price) =>
        sum + parseFloat(price.replace('$', '')),
      0
    );
  }

  async removeItem(itemName: string) {
    const item = this.cartItems.filter({
      hasText: itemName,
    });

    await item.locator('button', {
      hasText: 'Remove',
    }).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}