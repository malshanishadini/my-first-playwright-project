// src/pages/InventoryPage.ts
import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class InventoryPage extends BasePage {
  // Locators
  readonly pageHeader: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly menuCloseButton: Locator;
  readonly resetAppStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator(".title");
    this.productList = page.locator(".inventory_list");
    this.productItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.menuCloseButton = page.locator("#react-burger-cross-btn");
    this.resetAppStateLink = page.locator("#reset_sidebar_link");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  // Navigation
  async goto() {
    await this.navigate("/inventory.html");
  }

  // Product actions
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productItems
      .locator(".inventory_item_name")
      .allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productItems
      .locator(".inventory_item_price")
      .allTextContents();

    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  async addProductToCart(productName: string) {
    const product = this.productItems.filter({
      hasText: productName,
    });

    await product.locator("button").click();
  }

  async removeProductFromCart(productName: string) {
    const product = this.productItems.filter({
      hasText: productName,
    });

    await product
      .locator("button", {
        hasText: "Remove",
      })
      .click();
  }

  async canAddProductToCart(productName: string): Promise<boolean> {
    const product = this.productItems.filter({
      hasText: productName,
    });

    return await product
      .locator("button", {
        hasText: "Add to cart",
      })
      .isVisible();
  }

  async getProductDetails(productName: string): Promise<{
    name: string;
    description: string;
    price: number;
  }> {
    const product = this.productItems.filter({
      hasText: productName,
    });

    const name = await product.locator(".inventory_item_name").textContent();
    const description = await product
      .locator(".inventory_item_desc")
      .textContent();
    const priceText = await product
      .locator(".inventory_item_price")
      .textContent();

    return {
      name: name?.trim() ?? "",
      description: description?.trim() ?? "",
      price: parseFloat(priceText?.replace("$", "") ?? "0"),
    };
  }

  // Sorting
  async sortProducts(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }

  // Cart
  async getCartCount(): Promise<number> {
    const badge = await this.cartBadge.textContent();

    return badge ? parseInt(badge) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async clickProduct(productName: string) {
    const product = this.productItems.filter({
      hasText: productName,
    });

    await product.locator(".inventory_item_name").click();
  }

  // Menu actions
  async openMenu() {
    await this.menuButton.click();
  }

  async closeMenu() {
    await this.menuCloseButton.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  // Verification Methods
  async verifyPageHeader(expectedHeader: string): Promise<void> {
    await expect(this.pageHeader).toHaveText(expectedHeader);
  }

  async verifyProductsSortedPriceLowHigh(): Promise<void> {
    const prices = await this.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    await expect(prices).toEqual(sortedPrices);
  }
}
