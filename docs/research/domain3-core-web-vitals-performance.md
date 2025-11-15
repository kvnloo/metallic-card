# Domain 3: Core Web Vitals & Performance Metrics Research

**Research Date:** 2025-11-14
**Focus:** 2025 Core Web Vitals standards + Next.js 15/React 19 + 3D animations optimization

---

## Executive Summary

Core Web Vitals remain critical for SEO and UX in 2025, with **INP replacing FID** as the responsiveness metric (March 2024). Next.js 15's instrumentation features and React 19's concurrent capabilities provide powerful optimization tools. 3D animations require careful lazy loading and model optimization to meet LCP targets.

**Key Insight:** The 75th percentile standard means **75% of page loads** must meet all three thresholds for "good" performance classification.

---

## 1. 2025 Core Web Vitals Thresholds

### Official "Good" Thresholds

| Metric | Good | Needs Improvement | Poor | Measures |
|--------|------|-------------------|------|----------|
| **LCP** | < 2.5s | 2.5-4.0s | > 4.0s | Loading speed |
| **INP** | < 200ms | 200-500ms | > 500ms | Responsiveness |
| **CLS** | < 0.1 | 0.1-0.25 | > 0.25 | Visual stability |

### Evaluation Standard
- **75th percentile** of page loads must meet thresholds
- Segmented across mobile and desktop devices
- All three metrics must pass for "Good" classification

### Key Change: INP Replaces FID
- **March 12, 2024:** INP officially replaced First Input Delay (FID)
- INP measures **all interactions** throughout page lifespan
- FID only measured first interaction latency
- INP better represents real responsiveness

---

## 2. Next.js 15 + React 19 INP Optimization

### React 18/19 Features for INP

**Selective Hydration with Suspense**
```jsx
// Faster hydration - components become interactive sooner
<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```
- Browser doesn't hydrate everything at once
- Components can become interactive faster
- No waiting for all JavaScript to load

**startTransition for Route Navigation**
```jsx
// Next.js 15 routing with interruptable transitions
import { startTransition } from 'react';

startTransition(() => {
  router.push('/new-route');
});
```
- Navigations interruptable if higher priority events occur
- Further improves responsiveness

### Next.js 15 Built-in Optimizations
- **Automatic code splitting** - Only load what's needed
- **Server-side rendering (SSR)** - Faster initial load
- **Static site generation (SSG)** - Pre-rendered pages
- **Route transitions** - Using React 18's startTransition

### React-Specific Techniques

**Uncontrolled Inputs for Best INP**
```jsx
// ❌ Controlled - React updates on every keystroke
<input value={text} onChange={e => setText(e.target.value)} />

// ✅ Uncontrolled - Browser handles updates
<input defaultValue={text} />
```
- Browser controls updates → better INP
- React doesn't re-render on every change

**React.memo for Preventing Re-renders**
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders when data changes
  return <ComplexUI data={data} />;
});
```

### General INP Optimizations
- **CSS animations over JavaScript** - Hardware accelerated
- **Throttle/debounce scroll events** - Reduce event handling
- **Reduce DOM size** - Fewer elements to recalculate
- **Defer non-critical JavaScript** - Improve time to interactive

---

## 3. Next.js 15 Instrumentation & Monitoring

### Client Instrumentation (New in 15.3)
```typescript
// instrumentation-client.ts
export async function register() {
  // Run before frontend code executes
  // Perfect for performance tracking setup
  if (typeof window !== 'undefined') {
    const { init } = await import('./performance-monitoring');
    init();
  }
}
```

**Key Benefits:**
- Monitoring code runs **before app becomes interactive**
- Ideal for setting up performance tracking early
- Captures full lifecycle metrics

### OpenTelemetry Integration
```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'metallic-card-portfolio' });
}
```

**Supported Integrations:**
- New Relic
- SigNoz
- Datadog
- Jaeger
- Any OpenTelemetry-compatible platform

### Server-Side Monitoring
- Built-in instrumentation for SSR
- Middleware transaction monitoring
- Transaction naming for page/server requests

---

## 4. LCP Optimization with 3D Animations

### Lazy Loading Three.js Components

**Problem:** Three.js imports increase Total Blocking Time and FCP

**Solution:** Delay component loading until after page load
```jsx
import { lazy, Suspense } from 'react';

const Scene3D = lazy(() => import('./components/Scene3D'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading 3D scene...</div>}>
      <Scene3D />
    </Suspense>
  );
}
```

### OffscreenCanvas & Web Workers

**Performance Impact:** 95 → 100 Lighthouse score

```typescript
// worker.ts
const offscreen = canvas.transferControlToOffscreen();
// Move WebGL rendering off main thread
```

**Benefits:**
- Full 100 Lighthouse Performance score
- Improved rendering on low-end devices
- Better average performance across devices

### Model Optimization Techniques

**File Size Reduction:**
- **Before:** 26MB → choppy animations, long load times
- **After:** 581KB with gltfjsx
- **Technique:** Use GLTF format with compression

**Low-Poly Models:**
- Fewer triangles = less CPU/GPU load
- Reduced processing time
- Maintains visual quality at distance

**Frustum Culling:**
- Don't render objects outside camera view
- Three.js handles automatically
- Significant performance savings

### Material & Shader Optimization

**Fewer Materials = Better Performance:**
```javascript
// ❌ Bad - Many materials
materials.forEach(mat => scene.add(new Mesh(geo, mat)));

// ✅ Good - Shared material
const sharedMat = new MeshStandardMaterial();
instances.forEach(pos => scene.add(new Mesh(geo, sharedMat)));
```

**Shader Processing:**
- Shader compilation on Windows especially slow
- Fewer shaders = less switching during render
- Reuse materials whenever possible

---

## 5. React Three Fiber Performance

### Code Splitting Strategy
```jsx
// Lazy load heavy 3D components
const MetallicCard = lazy(() => import('./components/MetallicCard3D'));

// Split by route
const ProjectScene = lazy(() => import('./scenes/ProjectScene'));
```

### Draw Calls Optimization

**Maximum Recommendations:**
- **Absolute max:** 1000 draw calls
- **Optimal:** Few hundred or less
- **Each mesh = 1 draw call**

**Instancing for Repeated Objects:**
```jsx
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000} geometry={sphereGeo} material={mat}>
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```
- Hundreds of thousands of objects in single draw call
- Massive performance improvement

### On-Demand Rendering
```jsx
import { Canvas } from '@react-three/fiber';

<Canvas frameloop='demand'>
  {/* Only renders when scene changes */}
</Canvas>
```
- Saves battery life
- Reduces fan noise
- Renders only when necessary

### Material & Geometry Sharing
```jsx
// ❌ Expensive - Creates new materials
{items.map(item => (
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial color={item.color} />
  </mesh>
))}

// ✅ Efficient - Reuses geometry
const sphereGeo = useMemo(() => new SphereGeometry(1, 32, 32), []);
```

### Performance Monitoring
- **r3f-perf** tool for React Three Fiber
- Displays shader/texture/vertex statistics
- Real-time performance metrics

---

## 6. CLS Optimization for Dynamic Content

### Measurement Tools

| Tool | Focus | Best For |
|------|-------|----------|
| **PageSpeed Insights** | Overall CWV | Quick analysis |
| **Lighthouse** | Lab testing | Development |
| **Web Vitals Tester** | Field data | Production monitoring |
| **Layout Shift GIF Generator** | Visual debugging | Identifying shifts |
| **CLS Debugger** | Element analysis | Deep investigation |

### Dynamic Content Issues

**Major Contributors:**
1. **Asynchronously loaded resources** - Images, fonts, styles
2. **Dynamically added DOM elements** - Inserted after initial render
3. **Advertisements** - Late-loading ad content
4. **Social media embeds** - Twitter, Instagram, Facebook widgets

### Optimization Techniques

**Reserve Space with Placeholders:**
```jsx
// ❌ Bad - Causes layout shift when image loads
<img src="hero.jpg" alt="Hero" />

// ✅ Good - Reserved space prevents shift
<div style={{ aspectRatio: '16/9', position: 'relative' }}>
  <img
    src="hero.jpg"
    alt="Hero"
    style={{ position: 'absolute', width: '100%', height: '100%' }}
  />
</div>
```

**Fixed Dimensions for Dynamic Content:**
```jsx
// Ad container with fixed height
<div style={{ minHeight: '250px' }}>
  {/* Ad loads here without causing shift */}
  <AdComponent />
</div>
```

**Place Dynamic Content Lower:**
- Content at top of viewport = greater layout shift impact
- Content lower in viewport = reduced CLS impact
- Consider placement strategy for ads/widgets

### Best Practices
- **Segment and inspect:** Analyze individual element contributions
- **Use 75th percentile:** Measure at 75th percentile of loads
- **Test across devices:** Mobile and desktop separately
- **Monitor field data:** Real users experience layout shifts differently

---

## 7. Production Measurement & RUM Tools

### Top RUM Tools for 2025

| Tool | Strengths | Price Point |
|------|-----------|-------------|
| **Akamai mPulse** | Scale, detailed CWV analysis | Enterprise |
| **Datadog** | APM + RUM integration | Enterprise |
| **DebugBear** | CWV-focused, detailed debug data | Mid-tier |
| **RUMvision** | Specialized CWV tool | Mid-tier |
| **CoreDash** | Real-time CWV tracking | $19/month |

### web-vitals JavaScript Library

**Lightweight Implementation (~2KB):**
```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => {
  // Send to analytics
  gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: metric.name,
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_delta: metric.delta,
  });
});

onINP(metric => { /* Same pattern */ });
onCLS(metric => { /* Same pattern */ });
```

### Measurement Best Practices

**Use Percentiles, Not Averages:**
- Averages don't represent any single user's session
- Outliers skew averages in misleading ways
- 75th percentile standard from Google

**Field Data is Critical:**
- Lab data (Lighthouse) != Real user experience
- Field data shows actual performance
- Impossible to validate improvements without field data

**Custom Metrics in RUM Tools:**
1. Define/register custom metric
2. Compute value in frontend JavaScript
3. Send to analytics backend

**Integration with Next.js 15:**
```typescript
// instrumentation-client.ts
export async function register() {
  if (typeof window !== 'undefined') {
    const { onCLS, onINP, onLCP } = await import('web-vitals');

    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
  }
}

function sendToAnalytics(metric: Metric) {
  // Send to your RUM tool
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}
```

---

## 8. Implementation Recommendations for Metallic Card Portfolio

### Priority 1: Foundation
1. **Implement web-vitals library** - Early performance tracking
2. **Set up Next.js 15 instrumentation** - Client + server monitoring
3. **Configure RUM tool** - DebugBear or CoreDash for budget

### Priority 2: LCP Optimization
1. **Lazy load 3D components** - React.lazy + Suspense
2. **Optimize 3D models** - Use gltfjsx, target < 500KB per model
3. **Implement OffscreenCanvas** - Move WebGL to worker thread
4. **Code split by route** - Separate 3D scenes per page

### Priority 3: INP Optimization
1. **Use uncontrolled inputs** - Forms with defaultValue
2. **Implement React.memo** - Prevent unnecessary re-renders
3. **Defer non-critical JS** - Load analytics/chat after interactive
4. **CSS animations only** - Avoid JS-driven animations

### Priority 4: CLS Prevention
1. **Reserve space for 3D canvas** - Fixed aspect ratio container
2. **Fixed dimensions for images** - Use next/image with proper sizing
3. **Placeholder for dynamic content** - Skeleton screens
4. **Font display: swap strategy** - Prevent layout shifts from fonts

### Priority 5: Monitoring & Iteration
1. **Track 75th percentile metrics** - All three CWV
2. **Monitor field data weekly** - Real user performance
3. **A/B test optimizations** - Validate improvements
4. **Set up alerts** - When metrics degrade

---

## 9. Technical Implementation Checklist

### Next.js 15 Configuration
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  // Enable compression
  compress: true,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

### Performance Monitoring Setup
```typescript
// instrumentation-client.ts
export async function register() {
  if (typeof window !== 'undefined') {
    const { onCLS, onINP, onLCP } = await import('web-vitals');
    const sendToAnalytics = (metric: Metric) => {
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        }),
        keepalive: true,
      });
    };

    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
  }
}
```

### 3D Component Lazy Loading
```tsx
// app/components/Scene3DLazy.tsx
import { lazy, Suspense } from 'react';

const Scene3D = lazy(() => import('./Scene3D'));

export default function Scene3DLazy() {
  return (
    <Suspense fallback={
      <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse" />
    }>
      <Scene3D />
    </Suspense>
  );
}
```

### CLS-Safe Image Loading
```tsx
// Using next/image with proper sizing
import Image from 'next/image';

<div className="relative w-full" style={{ aspectRatio: '16/9' }}>
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />
</div>
```

---

## 10. Key Takeaways

### Critical Success Factors
1. **75th percentile standard** - 75% of loads must pass all three metrics
2. **INP is now critical** - Replaced FID, measures all interactions
3. **Field data is essential** - Lab tests don't show real performance
4. **3D requires special care** - Lazy loading + model optimization mandatory

### Next.js 15 Advantages
- Built-in OpenTelemetry instrumentation
- Client instrumentation hook for early tracking
- Automatic code splitting and optimization
- React 19 concurrent features for better INP

### 3D Animation Strategy
- Lazy load all Three.js components
- Use OffscreenCanvas + Web Workers
- Optimize models to < 500KB each
- Instance repeated geometry
- On-demand rendering when idle

### Monitoring Approach
- Implement web-vitals library (~2KB)
- Use RUM tool for production tracking
- Monitor 75th percentile metrics
- Set up alerts for degradation

---

## Sources
- web.dev/vitals - Official Core Web Vitals documentation
- Next.js documentation - Instrumentation and performance guides
- Vercel blog - React 18 + INP optimization
- React Three Fiber docs - Performance best practices
- DebugBear, RUMvision, Akamai - RUM tool documentation
- Three.js community forums - Optimization techniques

**Confidence Level:** 85% (High confidence in official sources, moderate confidence in 3D-specific optimizations)

**Research Completed:** 2025-11-14
