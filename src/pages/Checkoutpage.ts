// src/pages/CheckoutPage.ts

import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class CheckoutPage extends BasePage {
  // Step 1: Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2: Overview
  readonly summaryInfo: Locator;
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly totalAmount: Locator;
  readonly finishButton: Locator;

  // Step 3: Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Step 1 locators
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2 locators
    this.summaryInfo = page.locator(".summary_info");
    this.itemTotal = page.locator(".summary_subtotal_label");
    this.taxAmount = page.locator(".summary_tax_label");
    this.totalAmount = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3 locators
    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Step 1: Fill checkout information
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  // Step 2: Overview verification
  async verifyOnStepTwo(): Promise<void> {
    await expect(this.summaryInfo).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotal.textContent();
    return this.parseCurrency(text);
  }

  async getTax(): Promise<number> {
    const text = await this.taxAmount.textContent();
    return this.parseCurrency(text);
  }

  async getTotalAsNumber(): Promise<number> {
    const text = await this.totalAmount.textContent();
    return this.parseCurrency(text);
  }

  async getTotalPrice(): Promise<string | null> {
    return await this.totalAmount.textContent();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  // Step 3: Completion
  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  async getCompletionMessage(): Promise<string | null> {
    return await this.completeHeader.textContent();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }

  async verifyOrderSuccess(): Promise<void> {
    await expect(this.completeHeader).toHaveText(/thank you for your order/i);
  }

  // Complete checkout flow
  async completeCheckout(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.fillShippingInfo(firstName, lastName, postalCode);

    await this.continueToOverview();
    await this.finishCheckout();
  }

  private parseCurrency(text: string | null): number {
    return parseFloat((text ?? "").replace(/[^0-9.]/g, ""));
  }
}
