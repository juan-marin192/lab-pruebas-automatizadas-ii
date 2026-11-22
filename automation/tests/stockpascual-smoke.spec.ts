import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Smoke y flujo E2E de negocio para StockPascual.
 */
test("login admin y ver dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Usuario").fill("admin");
  await page.getByLabel("Contraseña").fill("Admin123!");
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(/Ana Admin/i)).toBeVisible();
});

test("operador no ve botón + Producto", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Usuario").fill("operador");
  await page.getByLabel("Contraseña").fill("Oper123!");
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Producto" })).toHaveCount(0);
});

async function registrarMovimiento(
  page: Page,
  sku: string,
  tipo: "IN" | "OUT",
  cantidad: number
) {
  await page.getByRole("button", { name: "+ Movimiento" }).click();

  const opcionProducto = page.locator("#m-product option").filter({ hasText: sku });
  await expect(opcionProducto).toHaveCount(1);
  const productId = await opcionProducto.getAttribute("value");
  if (!productId) {
    throw new Error(`No se encontro el id del producto ${sku}`);
  }

  await page.locator("#m-product").selectOption(productId);
  await page.getByLabel("Tipo").selectOption(tipo);
  await page.getByLabel("Cantidad").fill(String(cantidad));
  await page.getByLabel("Motivo").fill(`Prueba E2E ${tipo}`);
  await page.getByRole("button", { name: "Registrar" }).click();
  await expect(page.locator("#movement-dialog")).not.toBeVisible();
}

test("admin crea producto, registra IN y OUT y valida stock bajo", async ({ page }) => {
  const sku = `E2E-${Date.now()}`;
  const stockEntrada = 5;
  const stockSalida = 4;
  const stockFinal = stockEntrada - stockSalida;
  const stockMinimo = 2;

  await page.goto("/");
  await page.getByLabel("Usuario").fill("admin");
  await page.getByLabel("Contraseña").fill("Admin123!");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.locator("#app-view")).toBeVisible();

  await page.getByRole("button", { name: "Productos", exact: true }).click();
  await page.getByRole("button", { name: "+ Producto" }).click();
  await page.getByLabel("SKU").fill(sku);
  await page.getByLabel("Nombre").fill(`Producto E2E ${sku}`);
  await page.getByLabel("Categoría").fill("General");
  await page.getByLabel("Precio (COP)").fill("12500");
  await page.getByLabel("Stock inicial").fill("0");
  await page.getByLabel("Stock mínimo").fill(String(stockMinimo));
  await page.getByLabel("Unidad").fill("und");
  await page.getByLabel("Ubicación").fill("E2E-01");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.locator("#product-dialog")).not.toBeVisible();

  await registrarMovimiento(page, sku, "IN", stockEntrada);
  await registrarMovimiento(page, sku, "OUT", stockSalida);

  await page.getByRole("button", { name: "Productos", exact: true }).click();
  const productRow = page.getByRole("row").filter({ hasText: sku });
  await expect(productRow).toBeVisible();
  await expect(productRow.locator("td").nth(4)).toHaveText(String(stockFinal));

  await page.getByRole("button", { name: "Alertas stock" }).click();
  const alertRow = page.locator("#alerts-table tr").filter({ hasText: sku });
  await expect(alertRow).toBeVisible();

  const evidenceDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../evidencias/paso7_automation"
  );
  await mkdir(evidenceDirectory, { recursive: true });
  await page.screenshot({
    path: path.join(evidenceDirectory, "e2e_stock_bajo.png"),
    fullPage: true,
  });
});
