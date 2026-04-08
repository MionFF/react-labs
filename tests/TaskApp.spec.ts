import test, { expect } from '@playwright/test'

test('redirects on /tasks after successful task create', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByLabel('Title').fill('Implement new feature')
  await page.getByLabel('Assignee email').fill('mikedev11@gmail.com')

  await expect(page.getByText('Title must be at least 3 characters')).toBeHidden()
  await expect(page.getByText('Enter a valid email')).toBeHidden()

  await page.getByRole('button', { name: 'Create task' }).click()

  await expect(page).toHaveURL(/created=1/)
  await expect(page.getByText('Task created successfully')).toBeVisible()
  await expect(page.getByRole('list', { name: 'Tasks list' })).toBeVisible()
  await expect(page.getByText(/Implement new feature/)).toBeVisible()
  await expect(page.getByText(/mikedev11@gmail.com/)).toBeVisible()
  await expect(page.getByText('Failed to load tasks')).toBeHidden()
})

test('renders server state in create task page', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByLabel('Title').fill('error')
  await page.getByLabel('Assignee email').fill('mikedev11@gmail.com')

  await expect(page.getByText('Title must be at least 3 characters')).toBeHidden()
  await expect(page.getByText('Enter a valid email')).toBeHidden()

  await page.getByRole('button', { name: 'Create task' }).click()
  await expect(page.getByText('Failed to create task')).toBeVisible()

  await expect(page).toHaveURL('/tasks/new')
  await expect(page).not.toHaveURL(/created=1/)

  await expect(page.getByRole('list', { name: 'Tasks list' })).toBeHidden()
})
