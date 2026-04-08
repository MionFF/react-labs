import test, { expect } from '@playwright/test'

test('renders users list after successful search', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search users').fill('Mion')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL(/q=Mion/)
  await expect(page.getByRole('list', { name: 'Users list' })).toBeVisible()
  await expect(page.getByText('Mion')).toBeVisible()
  await expect(page.getByText('Enter a search query')).not.toBeVisible()
  await expect(page.getByText('No users found')).not.toBeVisible()
  await expect(page.getByText('Failed to load users')).not.toBeVisible()
})

test('renders error state after failed search', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search users').fill('ErrorCase')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL(/q=ErrorCase/)
  await expect(page.getByText('Failed to load users')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Users list' })).not.toBeVisible()
  await expect(page.getByText('ErrorCase')).not.toBeVisible()
})

test('renders empty state after searching for unknown user', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search users').fill('Nobody')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL(/q=Nobody/)
  await expect(page.getByText('No users found')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Users list' })).not.toBeVisible()
  await expect(page.getByText('Nobody')).not.toBeVisible()
})
