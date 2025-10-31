# Cross-Platform Testing Guide

## Quick Testing Checklist

### iOS Safari (iPhone/iPad)

**Critical Tests:**
- [ ] Scroll animation is smooth (60fps)
- [ ] Card tilt responds immediately to touch/mouse
- [ ] No 300ms tap delay on buttons
- [ ] Transitions use hardware acceleration (no jank)
- [ ] Background blur renders correctly
- [ ] Touch events don't trigger unwanted browser actions

**Expected Behavior:**
- Smooth scroll with `translate3d` acceleration
- Immediate button feedback (no delay)
- Clean animations with `-webkit-` prefixed properties

**Common Issues:**
- If scroll is janky: Check for `translate3d(0,0,0)` in inline styles
- If buttons lag: Verify `touch-action: manipulation` is applied
- If animations stutter: Ensure `-webkit-transform` is present

### Android Chrome

**Critical Tests:**
- [ ] Scroll performance matches iOS
- [ ] GPU acceleration working (check DevTools layers)
- [ ] No memory leaks during extended use
- [ ] Touch events are responsive
- [ ] Blur filters render without lag

**Expected Behavior:**
- Smooth 60fps scroll
- Clean layer composition
- Efficient memory usage

**Common Issues:**
- If filters slow: Check media query breakpoints (should disable on mobile)
- If memory grows: Verify RAF cleanup in useEffect
- If touch feels delayed: Ensure passive listeners are used

## Device-Specific Testing

### High-End Devices (iPhone 13+, Pixel 6+)

**What to Test:**
- All features enabled (full blur, complex filters)
- Performance should be flawless
- Memory usage should be reasonable (<50MB)

**Expected Performance:**
- Consistent 60fps
- < 100ms response time
- Smooth transitions

### Mid-Range Devices (iPhone XR, Samsung A-series)

**What to Test:**
- Reduced effects kick in correctly
- Still maintain 60fps or graceful degradation to 30fps
- No janky animations

**Expected Performance:**
- 60fps scroll, 30-60fps animations
- < 150ms response time
- Simplified blur effects

### Low-End Devices (Older Android, budget phones)

**What to Test:**
- Complex filters disabled
- Minimal blur or no blur
- Basic animations still work

**Expected Performance:**
- 30fps minimum
- < 200ms response time
- Graceful degradation

## Browser-Specific Testing

### iOS Safari
```
Test URL: https://your-site.com
Device: iPhone (any model with iOS 13+)
Browser: Safari (default)
```

**Key Checks:**
1. Open DevTools via Desktop Safari → Develop menu
2. Check Layers tab for GPU acceleration
3. Monitor Memory tab during scroll
4. Verify no console errors

### iOS Chrome
```
Test URL: https://your-site.com
Device: iPhone (any model)
Browser: Chrome
```

**Note:** Uses WebKit engine, should behave like Safari

### Android Chrome
```
Test URL: https://your-site.com
Device: Android (any model)
Browser: Chrome
```

**Key Checks:**
1. Open chrome://inspect on desktop
2. Check Performance tab
3. Verify 60fps during scroll
4. Check layer composition

## Testing Tools

### Chrome DevTools (Desktop + Remote Android)

**Setup:**
1. Enable USB debugging on Android
2. Open `chrome://inspect` on desktop
3. Select your device
4. Inspect the page

**What to Check:**
- Performance: Record 10 second scroll session
- Memory: Heap snapshots before/after interaction
- Layers: Verify GPU acceleration
- Network: Check asset loading

### Safari Web Inspector (Desktop + Remote iOS)

**Setup:**
1. Enable Web Inspector on iPhone (Settings → Safari → Advanced)
2. Connect iPhone via USB
3. Open Safari on Mac → Develop → [Your iPhone]
4. Select the page

**What to Check:**
- Timelines: Check for dropped frames
- Layers: Verify compositing
- Console: Check for warnings
- Resources: Verify asset loading

### BrowserStack / Real Device Cloud

**Recommended Test Matrix:**
```
iOS Safari:
- iPhone SE (iOS 15) - Low-end
- iPhone 12 (iOS 16) - Mid-range
- iPhone 14 Pro (iOS 17) - High-end

Android Chrome:
- Samsung Galaxy A53 - Mid-range
- Google Pixel 6 - High-end
- OnePlus Nord - Budget

iPad:
- iPad Air (2020) - Tablet
```

## Performance Metrics to Track

### Core Web Vitals

**Largest Contentful Paint (LCP):**
- Target: < 2.5s
- Good: < 2.0s
- Test: Lighthouse in DevTools

**First Input Delay (FID):**
- Target: < 100ms
- Good: < 50ms
- Test: Real user interaction

**Cumulative Layout Shift (CLS):**
- Target: < 0.1
- Good: < 0.05
- Test: Lighthouse in DevTools

### Custom Metrics

**Scroll FPS:**
```javascript
// Add to page to measure scroll performance
let lastTime = performance.now()
let frames = 0

function measureFPS() {
  frames++
  const now = performance.now()
  if (now >= lastTime + 1000) {
    console.log(`Scroll FPS: ${frames}`)
    frames = 0
    lastTime = now
  }
  requestAnimationFrame(measureFPS)
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(measureFPS)
}, { passive: true })
```

**Memory Usage:**
```javascript
// Check memory (Chrome only)
if (performance.memory) {
  console.log('Used JS Heap:',
    (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB')
}
```

## Common Issues & Solutions

### Issue: Scroll feels janky on iOS

**Diagnosis:**
- Open Safari Web Inspector
- Check Timelines for dropped frames
- Look for forced reflows

**Solutions:**
1. Verify `translate3d(0,0,0)` in transforms
2. Check `-webkit-transform` prefixes exist
3. Ensure `will-change` is only set during animation
4. Verify passive scroll listeners

### Issue: Buttons don't respond immediately

**Diagnosis:**
- Check if 300ms delay exists
- Verify touch-action property

**Solutions:**
1. Add `touch-action: manipulation` to buttons
2. Verify `-webkit-tap-highlight-color: transparent`
3. Check viewport meta tag includes `width=device-width`

### Issue: Memory keeps growing

**Diagnosis:**
- Take heap snapshots in DevTools
- Check for detached DOM nodes
- Look for event listeners not being cleaned up

**Solutions:**
1. Verify RAF cleanup in useEffect
2. Check for removed event listeners
3. Ensure no circular references
4. Verify `will-change` is reset to 'auto'

### Issue: Animations are choppy

**Diagnosis:**
- Record Performance timeline
- Check for long tasks
- Look for forced reflows

**Solutions:**
1. Use RAF for all animations
2. Batch DOM reads/writes
3. Avoid expensive filters on mobile
4. Check media queries for progressive enhancement

## Automated Testing

### Lighthouse CI

Add to your CI/CD pipeline:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v8
        with:
          urls: |
            https://your-site.com
          uploadArtifacts: true
```

### Playwright Mobile Emulation

```javascript
// tests/mobile.spec.ts
import { test, expect } from '@playwright/test'

test('mobile performance', async ({ page }) => {
  // Emulate iPhone 13
  await page.emulate({
    userAgent: 'iPhone',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  })

  await page.goto('https://your-site.com')

  // Test scroll performance
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight)
  })

  // Verify smooth scroll
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      let frames = 0
      const start = performance.now()

      function countFrames() {
        frames++
        if (performance.now() - start < 1000) {
          requestAnimationFrame(countFrames)
        } else {
          resolve(frames)
        }
      }

      requestAnimationFrame(countFrames)
    })
  })

  expect(fps).toBeGreaterThan(50) // Minimum 50fps
})
```

## Manual Testing Script

**Run through this checklist for each platform:**

1. **Load Test**
   - [ ] Page loads in < 3 seconds
   - [ ] No console errors
   - [ ] All assets load correctly

2. **Scroll Test**
   - [ ] Scroll feels smooth (60fps)
   - [ ] Card animation is responsive
   - [ ] No jank or stuttering

3. **Interaction Test**
   - [ ] Hover/touch on card works immediately
   - [ ] Buttons respond without delay
   - [ ] Touch doesn't trigger unwanted browser actions

4. **Visual Test**
   - [ ] Blur effects render correctly
   - [ ] Colors match design
   - [ ] Animations are smooth
   - [ ] No visual glitches

5. **Memory Test**
   - [ ] No memory leaks after 2 minutes
   - [ ] Memory stays below 100MB
   - [ ] No growing heap size

6. **Battery Test** (on device)
   - [ ] No excessive battery drain
   - [ ] Device doesn't get hot
   - [ ] Remains responsive after 5 minutes

## Report Template

```markdown
# Cross-Platform Test Report

**Date:** YYYY-MM-DD
**Tester:** Name
**Build:** Version/Commit

## Device Information
- Device: [iPhone 13 / Pixel 6 / etc.]
- OS: [iOS 17.2 / Android 13]
- Browser: [Safari 17 / Chrome 120]

## Test Results

### Performance
- Load Time: [X.X]s
- Scroll FPS: [XX]fps
- Memory Usage: [XX]MB
- Battery Impact: [Low/Medium/High]

### Visual
- [ ] PASS - All effects render correctly
- [ ] PASS - No visual glitches
- [ ] PASS - Smooth animations

### Interaction
- [ ] PASS - No tap delay
- [ ] PASS - Responsive touch/hover
- [ ] PASS - Buttons work correctly

## Issues Found
1. [Description] - Severity: [Low/Medium/High]
2. [Description] - Severity: [Low/Medium/High]

## Recommendations
- [Any suggested improvements]
```

## Continuous Monitoring

### Set Up Monitoring

Use Real User Monitoring (RUM) to track actual user performance:

```javascript
// Add to page
if ('PerformanceObserver' in window) {
  // Monitor LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // Monitor FID
  const fidObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime)
    })
  })
  fidObserver.observe({ entryTypes: ['first-input'] })
}
```

## Success Criteria

**Ship when:**
- ✅ All critical tests pass on iOS Safari
- ✅ All critical tests pass on Android Chrome
- ✅ Performance metrics meet targets
- ✅ No memory leaks detected
- ✅ Lighthouse score > 90
- ✅ Real device testing confirms smooth experience

**Don't ship if:**
- ❌ Scroll is janky on any platform
- ❌ Buttons have noticeable delay
- ❌ Memory grows continuously
- ❌ Visual glitches on any device
- ❌ Battery drain is excessive
