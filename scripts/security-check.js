#!/usr/bin/env node

/**
 * Karma Web App - 环境变量安全检查脚本
 *
 * 这个脚本会检查:
 * 1. .env.local 文件是否存在
 * 2. 必需的环境变量是否配置
 * 3. API Key 格式是否正确
 * 4. .gitignore 是否正确配置
 * 5. 敏感文件是否被 git 追踪
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMark(passed) {
  return passed ? '✓' : '✗';
}

// 检查结果统计
let totalChecks = 0;
let passedChecks = 0;
let warnings = [];
let errors = [];

function runCheck(name, checkFn) {
  totalChecks++;
  try {
    const result = checkFn();
    if (result.passed) {
      passedChecks++;
      log(`${checkMark(true)} ${name}`, 'green');
      if (result.message) {
        log(`  ${result.message}`, 'blue');
      }
    } else {
      if (result.severity === 'error') {
        errors.push(name);
        log(`${checkMark(false)} ${name}`, 'red');
      } else {
        warnings.push(name);
        log(`⚠ ${name}`, 'yellow');
      }
      if (result.message) {
        log(`  ${result.message}`, result.severity === 'error' ? 'red' : 'yellow');
      }
    }
  } catch (error) {
    errors.push(name);
    log(`${checkMark(false)} ${name}`, 'red');
    log(`  错误: ${error.message}`, 'red');
  }
}

// 检查 1: .env.local 文件存在
function checkEnvFileExists() {
  const envPath = path.join(process.cwd(), '.env.local');
  const exists = fs.existsSync(envPath);

  return {
    passed: exists,
    severity: 'error',
    message: exists
      ? '环境变量文件存在'
      : '未找到 .env.local 文件。请复制 .env.local.example 并配置。'
  };
}

// 检查 2: OPENAI_API_KEY 配置
function checkOpenAIKey() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    return { passed: false, severity: 'error', message: '无法检查: .env.local 不存在' };
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const keyMatch = envContent.match(/OPENAI_API_KEY=(.+)/);

  if (!keyMatch) {
    return {
      passed: false,
      severity: 'error',
      message: 'OPENAI_API_KEY 未配置'
    };
  }

  const key = keyMatch[1].trim();

  // 检查 key 格式
  if (!key.startsWith('sk-')) {
    return {
      passed: false,
      severity: 'error',
      message: 'OPENAI_API_KEY 格式不正确 (应以 sk- 开头)'
    };
  }

  // 检查是否是示例 key
  if (key.includes('your-key-here') || key.includes('xxx')) {
    return {
      passed: false,
      severity: 'error',
      message: 'OPENAI_API_KEY 仍然是示例值，请配置真实的 key'
    };
  }

  // 检查 key 长度
  if (key.length < 40) {
    return {
      passed: false,
      severity: 'warning',
      message: 'OPENAI_API_KEY 长度似乎不正确'
    };
  }

  return {
    passed: true,
    message: `API Key 已配置 (${key.substring(0, 10)}...${key.substring(key.length - 4)})`
  };
}

// 检查 3: .gitignore 配置
function checkGitignore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');

  if (!fs.existsSync(gitignorePath)) {
    return {
      passed: false,
      severity: 'error',
      message: '.gitignore 文件不存在'
    };
  }

  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');

  const requiredPatterns = [
    { pattern: '.env.local', description: '.env.local 文件' },
    { pattern: '.env*', description: '所有 .env 文件' },
    { pattern: '*.pem', description: 'PEM 证书文件' },
  ];

  const missing = [];
  for (const { pattern, description } of requiredPatterns) {
    if (!gitignoreContent.includes(pattern)) {
      missing.push(description);
    }
  }

  if (missing.length > 0) {
    return {
      passed: false,
      severity: 'error',
      message: `缺少以下配置: ${missing.join(', ')}`
    };
  }

  return { passed: true, message: '所有必需的忽略规则已配置' };
}

// 检查 4: 敏感文件未被 git 追踪
function checkGitTracking() {
  try {
    // 检查 .env.local 是否被追踪
    const result = execSync('git ls-files .env.local 2>/dev/null', { encoding: 'utf-8' });

    if (result.trim()) {
      return {
        passed: false,
        severity: 'error',
        message: '.env.local 正在被 git 追踪！请立即运行: git rm --cached .env.local'
      };
    }

    return { passed: true, message: '敏感文件未被 git 追踪' };
  } catch (error) {
    // git ls-files 返回空时会有退出码，这是正常的
    return { passed: true, message: '敏感文件未被 git 追踪' };
  }
}

// 检查 5: .env.local.example 存在
function checkEnvExample() {
  const examplePath = path.join(process.cwd(), '.env.local.example');
  const exists = fs.existsSync(examplePath);

  if (!exists) {
    return {
      passed: false,
      severity: 'warning',
      message: '.env.local.example 不存在，建议创建示例文件'
    };
  }

  // 检查示例文件是否包含真实 key
  const content = fs.readFileSync(examplePath, 'utf-8');
  if (content.includes('sk-proj-')) {
    return {
      passed: false,
      severity: 'error',
      message: '.env.local.example 包含真实的 API key！请替换为示例值'
    };
  }

  return { passed: true, message: '示例文件存在且安全' };
}

// 检查 6: package.json 中的安全脚本
function checkSecurityScripts() {
  const packagePath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packagePath)) {
    return { passed: false, severity: 'warning', message: 'package.json 不存在' };
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const scripts = packageJson.scripts || {};

  if (!scripts['security:check']) {
    return {
      passed: false,
      severity: 'warning',
      message: '建议在 package.json 中添加 "security:check" 脚本'
    };
  }

  return { passed: true, message: '安全检查脚本已配置' };
}

// 检查 7: Node 版本
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

  if (majorVersion < 18) {
    return {
      passed: false,
      severity: 'warning',
      message: `Node.js 版本 ${nodeVersion} 较低，建议升级到 18+ 以获得更好的安全性`
    };
  }

  return { passed: true, message: `Node.js 版本 ${nodeVersion} ✓` };
}

// 运行所有检查
function runAllChecks() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'magenta');
  log('║      Karma Web App - 环境变量安全检查                ║', 'magenta');
  log('╚═══════════════════════════════════════════════════════╝\n', 'magenta');

  log('开始运行安全检查...\n', 'blue');

  runCheck('检查 .env.local 文件', checkEnvFileExists);
  runCheck('检查 OPENAI_API_KEY 配置', checkOpenAIKey);
  runCheck('检查 .gitignore 配置', checkGitignore);
  runCheck('检查 git 追踪状态', checkGitTracking);
  runCheck('检查 .env.local.example', checkEnvExample);
  runCheck('检查安全脚本配置', checkSecurityScripts);
  runCheck('检查 Node.js 版本', checkNodeVersion);

  // 输出总结
  log('\n' + '═'.repeat(60), 'blue');
  log('检查结果总结', 'blue');
  log('═'.repeat(60) + '\n', 'blue');

  log(`总检查项: ${totalChecks}`, 'blue');
  log(`通过: ${passedChecks}`, 'green');
  log(`警告: ${warnings.length}`, 'yellow');
  log(`错误: ${errors.length}`, 'red');

  if (errors.length > 0) {
    log('\n⚠️  发现严重错误，请立即处理:', 'red');
    errors.forEach(error => log(`  - ${error}`, 'red'));
  }

  if (warnings.length > 0) {
    log('\n⚠️  警告事项:', 'yellow');
    warnings.forEach(warning => log(`  - ${warning}`, 'yellow'));
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('\n🎉 所有检查通过！你的环境配置是安全的。', 'green');
  } else {
    log('\n📖 请查看 API-KEY-SECURITY-GUIDE.md 了解详细的安全配置指南。', 'blue');
  }

  log('');

  // 返回退出码
  return errors.length > 0 ? 1 : 0;
}

// 执行检查
const exitCode = runAllChecks();
process.exit(exitCode);
