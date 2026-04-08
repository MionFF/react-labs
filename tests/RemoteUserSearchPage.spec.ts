import test, { expect } from '@playwright/test'

test('shows mocked users on search', async ({ page }) => {
  await page.route('**/users/search?*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [{ id: 1, firstName: 'William', lastName: 'James' }],
      }),
    })
  })

  await page.goto('/remote-users')
  await page.getByLabel('Search users').fill('Jam')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByRole('list', { name: 'Users list' })).toBeVisible()
  await expect(page.getByText(/James/)).toBeVisible()
  await expect(page.getByText('Failed to load users')).toBeHidden()
})

test('shows error on failed mocked request', async ({ page }) => {
  await page.route('**/users/search?*', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Failed to search user' }),
    })
  })

  await page.goto('/remote-users')
  await page.getByLabel('Search users').fill('Mion')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('Failed to load users')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Users list' })).toHaveCount(0)
  await expect(page.getByText('No users found')).toBeHidden()
})
