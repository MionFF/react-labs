import test, { expect } from '@playwright/test'

test('redirects on confirmation page after mocked successful payment', async ({ page }) => {
  await page.route('**/api/checkout', async route => {
    const method = route.request().method()

    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
      return
    }

    await route.continue()
  })

  await page.goto('/checkout')
  await page.getByLabel('Card number').fill('4000 0330 0330 0335')
  await page.getByLabel('Expiry').fill('03/2030')
  await page.getByLabel('CVC').fill('7373')
  await page.getByLabel('Phone').fill('89513012343')
  await page.getByRole('button', { name: 'Pay now' }).click()

  await expect(page).toHaveURL(/confirmation/)
  await expect(page.getByText('Confirmation')).toBeVisible()
  await expect(page.getByText('Order ID: 12345')).toBeVisible()
})

test('shows error on mocked failed payment', async ({ page }) => {
  await page.route('**/api/checkout', async route => {
    const method = route.request().method()

    if (method === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Payment failed' }),
      })
      return
    }

    await route.continue()
  })

  await page.goto('/checkout')
  await page.getByLabel('Card number').fill('4000 0330 0330 0335')
  await page.getByLabel('Expiry').fill('03/2030')
  await page.getByLabel('CVC').fill('7373')
  await page.getByLabel('Phone').fill('89513012343')
  await page.getByRole('button', { name: 'Pay now' }).click()

  await expect(page).toHaveURL(/checkout/)
  await expect(page).not.toHaveURL(/confirmation/)
  await expect(page.getByText('Payment failed')).toBeVisible()
  await expect(page.getByText('Confirmation')).toHaveCount(0)
  await expect(page.getByText('Order ID: 12345')).toHaveCount(0)
})
