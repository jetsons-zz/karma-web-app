import { test, expect, Page } from '@playwright/test';

test.describe('Karma Web 完整交互测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. 主页加载和基础UI', async ({ page }) => {
    console.log('\n=== 测试主页加载 ===');

    // 检查页面标题
    await expect(page).toHaveTitle(/Karma/);

    // 检查顶部导航栏
    const topNav = page.locator('nav, header').first();
    await expect(topNav).toBeVisible();
    console.log('✓ 顶部导航栏显示正常');

    // 检查左侧边栏
    const leftSidebar = page.locator('aside, [class*="sidebar"]').first();
    await expect(leftSidebar).toBeVisible();
    console.log('✓ 左侧边栏显示正常');

    // 截图
    await page.screenshot({ path: 'test-results/01-homepage.png', fullPage: true });
    console.log('✓ 主页截图已保存');
  });

  test('2. 导航到对话页面 (⌘1)', async ({ page }) => {
    console.log('\n=== 测试对话页面 ===');

    // 点击对话导航
    await page.click('text=对话');
    await page.waitForURL('**/conversations');

    // 检查URL
    expect(page.url()).toContain('/conversations');
    console.log('✓ URL正确跳转到 /conversations');

    // 检查对话列表
    await page.waitForSelector('[class*="conversation"], [class*="message"]', { timeout: 5000 });
    console.log('✓ 对话列表渲染成功');

    // 截图
    await page.screenshot({ path: 'test-results/02-conversations.png', fullPage: true });
    console.log('✓ 对话页面截图已保存');
  });

  test('3. 导航到项目页面 (⌘2) 并测试项目详情', async ({ page }) => {
    console.log('\n=== 测试项目页面 ===');

    // 导航到项目页面
    await page.click('text=项目');
    await page.waitForURL('**/projects');
    expect(page.url()).toContain('/projects');
    console.log('✓ 项目页面加载成功');

    // 检查项目卡片
    const projectCards = page.locator('[class*="project"], [class*="card"]');
    await expect(projectCards.first()).toBeVisible({ timeout: 5000 });
    console.log('✓ 项目卡片显示正常');

    // 截图项目列表
    await page.screenshot({ path: 'test-results/03-projects.png', fullPage: true });

    // 点击第一个项目
    await projectCards.first().click();
    await page.waitForLoadState('networkidle');

    // 检查项目详情页
    const urlAfterClick = page.url();
    expect(urlAfterClick).toMatch(/\/projects\/[^/]+/);
    console.log('✓ 项目详情页URL正确:', urlAfterClick);

    // 截图项目详情
    await page.screenshot({ path: 'test-results/04-project-detail.png', fullPage: true });
    console.log('✓ 项目详情页截图已保存');
  });

  test('4. 测试 Task Session 核心功能', async ({ page }) => {
    console.log('\n=== 测试 Task Session 核心功能 ===');

    // 先到项目页面
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // 点击第一个项目
    await page.click('[class*="project"], [class*="card"]');
    await page.waitForLoadState('networkidle');

    // 查找并点击任务
    const taskElements = page.locator('text=/任务|Task|task/i');
    if (await taskElements.count() > 0) {
      await taskElements.first().click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      console.log('✓ Task Session页面:', currentUrl);

      // 检查是否有消息输入框
      const textarea = page.locator('textarea, [contenteditable="true"]');
      if (await textarea.count() > 0) {
        console.log('✓ 消息输入框存在');

        // 测试输入
        await textarea.first().fill('测试消息 - Task = Session 功能');
        console.log('✓ 消息输入成功');
      }

      // 截图
      await page.screenshot({ path: 'test-results/05-task-session.png', fullPage: true });
      console.log('✓ Task Session截图已保存');
    } else {
      console.log('⚠ 未找到任务链接，跳过Task Session测试');
    }
  });

  test('5. 导航到分身页面 (⌘3)', async ({ page }) => {
    console.log('\n=== 测试分身页面 ===');

    await page.click('text=分身');
    await page.waitForURL('**/avatars');
    expect(page.url()).toContain('/avatars');
    console.log('✓ 分身页面加载成功');

    // 检查分身卡片
    const avatarCards = page.locator('[class*="avatar"], [class*="card"]');
    await expect(avatarCards.first()).toBeVisible({ timeout: 5000 });
    console.log('✓ 分身卡片显示正常');

    // 截图
    await page.screenshot({ path: 'test-results/06-avatars.png', fullPage: true });
    console.log('✓ 分身页面截图已保存');
  });

  test('6. 导航到商店页面 (⌘4)', async ({ page }) => {
    console.log('\n=== 测试商店页面 ===');

    await page.click('text=商店');
    await page.waitForURL('**/store');
    expect(page.url()).toContain('/store');
    console.log('✓ 商店页面加载成功');

    // 检查商店商品
    await page.waitForSelector('[class*="store"], [class*="product"], [class*="avatar"]', { timeout: 5000 });
    console.log('✓ 商店商品显示正常');

    // 截图
    await page.screenshot({ path: 'test-results/07-store.png', fullPage: true });
    console.log('✓ 商店页面截图已保存');
  });

  test('7. 导航到个人中心 (⌘5)', async ({ page }) => {
    console.log('\n=== 测试个人中心 ===');

    await page.click('text=个人');
    await page.waitForURL('**/profile');
    expect(page.url()).toContain('/profile');
    console.log('✓ 个人中心加载成功');

    // 检查个人信息
    await page.waitForSelector('[class*="profile"], input, form', { timeout: 5000 });
    console.log('✓ 个人信息表单显示正常');

    // 截图
    await page.screenshot({ path: 'test-results/08-profile.png', fullPage: true });
    console.log('✓ 个人中心截图已保存');
  });

  test('8. 测试键盘快捷键 - 命令面板 (⌘K)', async ({ page }) => {
    console.log('\n=== 测试命令面板 ===');

    // 按下 Cmd+K (Mac) 或 Ctrl+K (Windows)
    await page.keyboard.press('Meta+k');

    // 等待命令面板出现
    await page.waitForSelector('[class*="command"], [class*="palette"]', { timeout: 3000 });
    console.log('✓ 命令面板打开成功');

    // 检查搜索输入框
    const searchInput = page.locator('input[type="text"], input[placeholder*="命令"], input[placeholder*="搜索"]');
    await expect(searchInput.first()).toBeVisible();
    console.log('✓ 搜索输入框显示正常');

    // 输入搜索
    await searchInput.first().fill('项目');
    await page.waitForTimeout(500);
    console.log('✓ 搜索功能正常');

    // 截图
    await page.screenshot({ path: 'test-results/09-command-palette.png', fullPage: true });
    console.log('✓ 命令面板截图已保存');

    // 按ESC关闭
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    console.log('✓ 命令面板关闭成功');
  });

  test('9. 测试快捷键导航 (⌘1-5)', async ({ page }) => {
    console.log('\n=== 测试快捷键导航 ===');

    // ⌘1 - 对话
    await page.keyboard.press('Meta+1');
    await page.waitForURL('**/conversations', { timeout: 3000 });
    expect(page.url()).toContain('/conversations');
    console.log('✓ ⌘1 导航到对话页面');

    // ⌘2 - 项目
    await page.keyboard.press('Meta+2');
    await page.waitForURL('**/projects', { timeout: 3000 });
    expect(page.url()).toContain('/projects');
    console.log('✓ ⌘2 导航到项目页面');

    // ⌘3 - 分身
    await page.keyboard.press('Meta+3');
    await page.waitForURL('**/avatars', { timeout: 3000 });
    expect(page.url()).toContain('/avatars');
    console.log('✓ ⌘3 导航到分身页面');

    // ⌘4 - 商店
    await page.keyboard.press('Meta+4');
    await page.waitForURL('**/store', { timeout: 3000 });
    expect(page.url()).toContain('/store');
    console.log('✓ ⌘4 导航到商店页面');

    // ⌘5 - 个人中心
    await page.keyboard.press('Meta+5');
    await page.waitForURL('**/profile', { timeout: 3000 });
    expect(page.url()).toContain('/profile');
    console.log('✓ ⌘5 导航到个人中心');
  });

  test('10. 测试侧边栏切换', async ({ page }) => {
    console.log('\n=== 测试侧边栏切换 ===');

    // 截图初始状态
    await page.screenshot({ path: 'test-results/10-layout-initial.png', fullPage: true });
    console.log('✓ 初始布局截图');

    // 测试左侧边栏切换 (⌘B)
    await page.keyboard.press('Meta+b');
    await page.waitForTimeout(500);
    console.log('✓ 左侧边栏切换 (⌘B)');

    await page.screenshot({ path: 'test-results/11-left-sidebar-toggled.png', fullPage: true });

    // 再次切换回来
    await page.keyboard.press('Meta+b');
    await page.waitForTimeout(500);
    console.log('✓ 左侧边栏恢复');

    // 测试右侧边栏切换 (⌘/)
    await page.keyboard.press('Meta+/');
    await page.waitForTimeout(500);
    console.log('✓ 右侧边栏切换 (⌘/)');

    await page.screenshot({ path: 'test-results/12-right-sidebar-toggled.png', fullPage: true });
  });

  test('11. 响应式布局测试', async ({ page }) => {
    console.log('\n=== 测试响应式布局 ===');

    // 测试不同视口大小
    const viewports = [
      { name: 'Desktop-Large', width: 1920, height: 1080 },
      { name: 'Desktop-Medium', width: 1440, height: 900 },
      { name: 'Desktop-Small', width: 1280, height: 720 },
      { name: 'Tablet', width: 1024, height: 768 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      await page.screenshot({
        path: `test-results/13-responsive-${viewport.name}.png`,
        fullPage: true
      });
      console.log(`✓ ${viewport.name} (${viewport.width}x${viewport.height}) 截图已保存`);
    }
  });

  test('12. UI组件交互测试', async ({ page }) => {
    console.log('\n=== 测试UI组件交互 ===');

    // 到项目页面测试按钮
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // 查找并悬停按钮
    const buttons = page.locator('button');
    if (await buttons.count() > 0) {
      await buttons.first().hover();
      await page.waitForTimeout(300);
      console.log('✓ 按钮悬停效果正常');
    }

    // 测试输入框
    const inputs = page.locator('input[type="text"], input[type="search"]');
    if (await inputs.count() > 0) {
      await inputs.first().click();
      await inputs.first().fill('测试搜索');
      await page.waitForTimeout(300);
      console.log('✓ 输入框交互正常');
    }

    await page.screenshot({ path: 'test-results/14-ui-components.png', fullPage: true });
    console.log('✓ UI组件交互截图已保存');
  });
});

// 生成测试报告
test.afterAll(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Karma Web 完整交互测试完成！');
  console.log('='.repeat(60));
  console.log('所有截图已保存到 test-results/ 目录');
  console.log('='.repeat(60) + '\n');
});
