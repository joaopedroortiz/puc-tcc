import { test, expect } from '@playwright/test';


test.describe('Testes de Integração - Work to Do', () => {
  test('Deve carregar a Landing Page com sucesso', async ({ page }) => {
    await page.goto('/');
  
    await expect(page.getByRole('heading', { name: 'Bem-vindo ao Work To Do' })).toBeVisible();
    
   const loginButton = page.getByRole('button', { name: /Entrar com Google/i });
    await expect(loginButton).toBeVisible();
  });

  test('Deve proteger a rota de criação e exibir login para usuário não autenticado', async ({ page }) => {

    await page.goto('/criar-missao');
    
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).not.toBeVisible();

    await expect(page.getByRole('button', { name: /Entrar com Google/i })).toBeVisible();
  });

});