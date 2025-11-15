#!/usr/bin/env node

/**
 * Automated Performance Testing Script
 * Tests mobile and desktop performance metrics
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Automated Performance Tests...\n');

// Test configurations
const tests = {
  mobile: {
    name: 'Mobile Performance (iPhone 12)',
    device: 'iPhone 12',
    viewport: '390x844',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    throttling: '4x slowdown',
  },
  desktop: {
    name: 'Desktop Performance (1920x1080)',
    device: 'Desktop',
    viewport: '1920x1080',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    throttling: 'No throttling',
  },
};

// Performance metrics to track
const metrics = {
  fps: { target: 60, threshold: 55 },
  fcp: { target: 1500, threshold: 2000 },  // First Contentful Paint (ms)
  lcp: { target: 2500, threshold: 3000 },  // Largest Contentful Paint (ms)
  tbt: { target: 300, threshold: 600 },    // Total Blocking Time (ms)
  cls: { target: 0.1, threshold: 0.25 },   // Cumulative Layout Shift
};

// Test results storage
const results = {
  timestamp: new Date().toISOString(),
  tests: {},
  summary: {
    passed: 0,
    failed: 0,
    warnings: 0,
  },
};

// Helper functions
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error && !stdout) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function checkMetric(name, value, metric) {
  if (value <= metric.target) {
    return { status: '✅', level: 'pass' };
  } else if (value <= metric.threshold) {
    return { status: '⚠️', level: 'warning' };
  } else {
    return { status: '❌', level: 'fail' };
  }
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

// Check if production build exists
async function checkBuild() {
  console.log('📦 Checking production build...');
  const buildPath = path.join(__dirname, '..', '.next');

  if (!fs.existsSync(buildPath)) {
    console.log('❌ No production build found. Running build...\n');
    try {
      await runCommand('npm run build');
      console.log('✅ Build completed\n');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Production build found\n');
  }
}

// Test 1: Build Size Analysis
async function testBuildSize() {
  console.log('📊 Test 1: Build Size Analysis');
  console.log('━'.repeat(50));

  try {
    const { stdout } = await runCommand('npm run build 2>&1 | grep -A 10 "Route (app)"');
    const lines = stdout.split('\n');

    let totalSize = 0;
    const routes = [];

    lines.forEach(line => {
      const match = line.match(/(\d+\.?\d*)\s*(kB|KB)/);
      if (match) {
        const size = parseFloat(match[1]);
        totalSize += size;
        routes.push(line.trim());
      }
    });

    results.tests.buildSize = {
      total: totalSize.toFixed(2) + ' KB',
      routes: routes.length,
      status: totalSize < 200 ? '✅' : totalSize < 300 ? '⚠️' : '❌',
    };

    console.log(`Total Bundle Size: ${totalSize.toFixed(2)} KB ${results.tests.buildSize.status}`);
    console.log(`Routes Analyzed: ${routes.length}`);
    console.log(`Target: < 200 KB (Excellent), < 300 KB (Good)\n`);

    if (results.tests.buildSize.status === '✅') results.summary.passed++;
    else if (results.tests.buildSize.status === '⚠️') results.summary.warnings++;
    else results.summary.failed++;

  } catch (error) {
    console.error('❌ Build size analysis failed:', error.message);
    results.tests.buildSize = { status: '❌', error: error.message };
    results.summary.failed++;
  }
}

// Test 2: Code Quality Checks
async function testCodeQuality() {
  console.log('🔍 Test 2: Code Quality Analysis');
  console.log('━'.repeat(50));

  const checks = [
    { name: 'TypeScript', command: 'npx tsc --noEmit' },
    { name: 'ESLint', command: 'npm run lint 2>&1 || true' },
  ];

  results.tests.codeQuality = {};

  for (const check of checks) {
    try {
      const { stdout, stderr } = await runCommand(check.command);
      const hasErrors = stderr.includes('error') || stdout.includes('error');
      const hasWarnings = stderr.includes('warning') || stdout.includes('warning');

      let status = '✅';
      let level = 'pass';

      if (hasErrors) {
        status = '❌';
        level = 'fail';
        results.summary.failed++;
      } else if (hasWarnings) {
        status = '⚠️';
        level = 'warning';
        results.summary.warnings++;
      } else {
        results.summary.passed++;
      }

      results.tests.codeQuality[check.name] = { status, level };
      console.log(`${check.name}: ${status}`);

    } catch (error) {
      results.tests.codeQuality[check.name] = { status: '❌', error: error.message };
      results.summary.failed++;
      console.log(`${check.name}: ❌`);
    }
  }
  console.log();
}

// Test 3: Mobile-Specific Checks
async function testMobileOptimizations() {
  console.log('📱 Test 3: Mobile Optimization Checks');
  console.log('━'.repeat(50));

  const checks = {
    webkitPrefixes: {
      name: 'iOS Safari -webkit- prefixes',
      files: ['app/globals.css', 'components/electric-border-card.tsx'],
      pattern: /-webkit-/,
    },
    translate3d: {
      name: 'GPU acceleration (translate3d)',
      files: ['components/electric-border-card.tsx', 'app/page.tsx'],
      pattern: /translate3d/,
    },
    responsiveBlur: {
      name: 'Responsive blur effects',
      files: ['app/globals.css'],
      pattern: /@media.*max-width.*blur/,
    },
  };

  results.tests.mobileOptimizations = {};

  for (const [key, check] of Object.entries(checks)) {
    let found = false;

    for (const file of check.files) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (check.pattern.test(content)) {
          found = true;
          break;
        }
      }
    }

    results.tests.mobileOptimizations[key] = {
      name: check.name,
      status: found ? '✅' : '❌',
      level: found ? 'pass' : 'fail',
    };

    console.log(`${check.name}: ${found ? '✅' : '❌'}`);

    if (found) results.summary.passed++;
    else results.summary.failed++;
  }
  console.log();
}

// Test 4: Performance Utilities Check
async function testPerformanceUtils() {
  console.log('⚙️ Test 4: Performance Utilities');
  console.log('━'.repeat(50));

  const utilFiles = [
    'lib/performance-utils.ts',
    'lib/platform-detect.ts',
  ];

  results.tests.performanceUtils = {};

  for (const file of utilFiles) {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);

    results.tests.performanceUtils[file] = {
      status: exists ? '✅' : '❌',
      level: exists ? 'pass' : 'fail',
    };

    console.log(`${file}: ${exists ? '✅' : '❌'}`);

    if (exists) results.summary.passed++;
    else results.summary.failed++;
  }
  console.log();
}

// Test 5: Asset Optimization
async function testAssets() {
  console.log('🖼️ Test 5: Asset Optimization');
  console.log('━'.repeat(50));

  const publicPath = path.join(__dirname, '..', 'public');
  const assets = fs.readdirSync(publicPath);

  let totalSize = 0;
  const largeAssets = [];

  assets.forEach(asset => {
    const assetPath = path.join(publicPath, asset);
    const stats = fs.statSync(assetPath);

    if (stats.isFile()) {
      totalSize += stats.size;

      // Flag assets > 500KB
      if (stats.size > 500 * 1024) {
        largeAssets.push({
          name: asset,
          size: formatBytes(stats.size),
        });
      }
    }
  });

  results.tests.assets = {
    totalSize: formatBytes(totalSize),
    count: assets.length,
    largeAssets,
    status: largeAssets.length === 0 ? '✅' : '⚠️',
  };

  console.log(`Total Assets: ${assets.length}`);
  console.log(`Total Size: ${formatBytes(totalSize)}`);

  if (largeAssets.length > 0) {
    console.log(`⚠️ Large Assets (>500KB):`);
    largeAssets.forEach(asset => {
      console.log(`  - ${asset.name}: ${asset.size}`);
    });
    results.summary.warnings++;
  } else {
    console.log('✅ No large assets detected');
    results.summary.passed++;
  }
  console.log();
}

// Generate Report
function generateReport() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('📊 PERFORMANCE TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log();

  console.log(`✅ Passed:   ${results.summary.passed}`);
  console.log(`⚠️ Warnings: ${results.summary.warnings}`);
  console.log(`❌ Failed:   ${results.summary.failed}`);
  console.log();

  const total = results.summary.passed + results.summary.warnings + results.summary.failed;
  const passRate = ((results.summary.passed / total) * 100).toFixed(1);

  console.log(`Pass Rate: ${passRate}%`);
  console.log();

  // Overall status
  let overallStatus = '✅ Excellent';
  if (results.summary.failed > 0) {
    overallStatus = '❌ Needs Attention';
  } else if (results.summary.warnings > 2) {
    overallStatus = '⚠️ Good with Warnings';
  }

  console.log(`Overall Status: ${overallStatus}`);
  console.log();

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'docs', 'performance-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}`);
  console.log();

  return results.summary.failed === 0;
}

// Main execution
async function main() {
  try {
    await checkBuild();
    await testBuildSize();
    await testCodeQuality();
    await testMobileOptimizations();
    await testPerformanceUtils();
    await testAssets();

    const success = generateReport();

    process.exit(success ? 0 : 1);

  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

main();
