import test, { expect } from '@playwright/test'

test('sends valid form and navigates to /dashboard on successful submit', async ({ page }) => {
  await page.route('**/api/signup', async route => {
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

  await page.goto('/signup')
  await page.getByLabel('Email').fill('medianoche@gmail.com')
  await page.getByLabel(/^password/i).fill('Ashley_LaCerdo12!')
  await page.getByLabel(/confirm password/i).fill('Ashley_LaCerdo12!')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/dashboard/)
  await expect(page.getByText('Failed to create account')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText('Welcome aboard')).toBeVisible()
})

test('shows error on failed submit', async ({ page }) => {
  await page.route('**/api/signup', async route => {
    const method = route.request().method()

    if (method === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      })
      return
    }

    await route.continue()
  })

  await page.goto('/signup')
  await page.getByLabel('Email').fill('medianoche@gmail.com')
  await page.getByLabel(/^password/i).fill('Ashley_LaCerdo12!')
  await page.getByLabel(/confirm password/i).fill('Ashley_LaCerdo12!')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/signup/)
  await expect(page).not.toHaveURL(/dashboard/)
  await expect(page.getByText('Failed to create account')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0)
  await expect(page.getByText('Welcome aboard')).toHaveCount(0)
})
