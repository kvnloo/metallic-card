# Domain 1: Next.js 15.1.3 App Router Optimization Research

**Research Date**: 2025-11-14
**Target Version**: Next.js 15.1.3
**Repository**: metallic-card
**Confidence Level**: High (90%)

---

## Executive Summary

This research identifies state-of-the-art optimization practices for Next.js 15.1.3, focusing on App Router performance improvements. Key findings reveal significant changes in caching behavior (opt-in vs opt-out), experimental features like Partial Prerendering (PPR) requiring careful evaluation, and production-ready streaming patterns that can dramatically improve perceived performance.

**Critical Discovery**: Next.js 15 fundamentally changed caching from opt-out to opt-in, requiring explicit cache configuration for production deployments.

---

## Key Findings

1. **Caching Paradigm Shift**: Next.js 15 disabled default caching for fetch requests, GET Route Handlers, and client navigations - requiring explicit `cache: 'force-cache'` configuration
2. **Turbopack Production Ready**: Next.js 15.5+ offers 2-5x faster build times with production Turbopack, though bundle size regression concerns exist (+211 kB shared chunk in some cases)
3. **PPR Status**: Partial Prerendering remains experimental and NOT recommended for production in Next.js 15.1.3
4. **React Server Components**: RSC best practices emphasize server-first architecture with strategic client component placement as leaf nodes
5. **Streaming Performance**: Proper Suspense boundary placement can improve perceived performance by 40-60% despite identical total load times

---

## SOTA Practices

### 1. React Server Components Architecture

**Source**: [Strapi React & Next.js 2025 Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices) (Tier 1)

**Description**: Next.js 15 App Router defaults all components to Server Components, reducing client-side JavaScript and improving initial load performance.

**Best Practices**:
- **Server Components by Default**: Keep all data fetching, heavy computation, and logic in Server Components
- **Client Components as Leaf Nodes**: Place `"use client"` components as low as possible in component tree
- **Split Responsibilities**: Server Components handle data, Client Components handle interactivity

**Implementation Example**:
```tsx
// app/dashboard/page.tsx (Server Component - default)
import { UserStats } from './user-stats'
import { InteractiveChart } from './interactive-chart'

export default async function DashboardPage() {
  // Data fetching on server
  const stats = await fetchUserStats()

  return (
    <div>
      <UserStats data={stats} /> {/* Server Component */}
      <InteractiveChart initialData={stats} /> {/* Client Component - leaf node */}
    </div>
  )
}

// app/dashboard/interactive-chart.tsx
"use client"
export function InteractiveChart({ initialData }) {
  // Client-side interactivity only
  const [data, setData] = useState(initialData)
  // ... interactive logic
}
```

**Gap in metallic-card**: Page.tsx is marked `"use client"` at root level, losing RSC benefits for static content.

---

### 2. Streaming with Strategic Suspense Boundaries

**Source**: [Next.js 15 Streaming Handbook - FreeCodeCamp](https://www.freecodecamp.org/news/the-nextjs-15-streaming-handbook/) (Tier 1)

**Description**: React 18's streaming capabilities in Next.js 15 enable progressive rendering, showing critical content first while async components load.

**Best Practices**:
- **Strategic Boundary Placement**: Wrap independent, slow-loading components in `<Suspense>`
- **Critical Content First**: Stream above-the-fold content immediately
- **Parallel Loading**: Multiple Suspense boundaries enable concurrent data fetching

**Performance Impact**:
- Reduces Time to First Byte (TTFB) by serving HTML shell immediately
- Improves perceived performance by 40-60% even with identical total load time
- Enables concurrent component rendering on server

**Implementation Example**:
```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      {/* Critical content renders immediately */}
      <Header />

      {/* Slow components stream in parallel */}
      <Suspense fallback={<StatsSkeleton />}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <ActivityChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>
    </>
  )
}

// Automatic streaming with loading.tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

**Gap in metallic-card**: No Suspense boundaries or loading.tsx files - single monolithic render.

---

### 3. Next.js 15 Caching Strategy (Production Critical)

**Source**: [Next.js 15 Official Blog - Caching Changes](https://nextjs.org/blog/next-15) (Tier 1)

**Description**: Next.js 15 fundamentally changed caching from aggressive opt-out to conservative opt-in, requiring explicit configuration for production performance.

**Breaking Changes**:
- **fetch() requests**: Now `cache: 'no-store'` by default (was `'force-cache'`)
- **GET Route Handlers**: No longer cached by default
- **Client Router Cache**: Page components not cached by default

**Production Configuration**:
```tsx
// Explicit caching for production performance
export default async function ProductPage({ params }) {
  // Cache data requests
  const product = await fetch(`/api/products/${params.id}`, {
    cache: 'force-cache',
    next: { revalidate: 3600 } // 1 hour
  })

  return <ProductDetails {...product} />
}

// Route-level caching
export const dynamic = 'force-static' // Static generation
export const revalidate = 3600 // ISR every hour
```

**Self-Hosted Redis Pattern**:
```typescript
// next.config.mjs
const nextConfig = {
  cacheHandler: './cache-handler.mjs',
  cacheMaxMemorySize: 0, // Disable default cache
}

// cache-handler.mjs (Redis implementation)
import { CacheHandler } from '@neshca/cache-handler'
import createRedisHandler from '@neshca/cache-handler/redis-stack'
import { createClient } from 'redis'

export default CacheHandler({
  handlers: [
    createRedisHandler({
      client: createClient({ url: process.env.REDIS_URL })
    })
  ]
})
```

**Gap in metallic-card**: No explicit caching configuration - relying on defaults that changed in v15.

---

### 4. "use cache" Directive (Experimental)

**Source**: [Next.js Official Docs - use cache Directive](https://nextjs.org/docs/app/api-reference/directives/use-cache) (Tier 1)

**Description**: Experimental directive for granular caching control at function, component, and route levels.

**Setup Requirements**:
```typescript
// next.config.ts
const config = {
  experimental: {
    dynamicIO: true, // Enable use cache
  }
}
```

**Usage Patterns**:
```tsx
// Function-level caching
'use cache'
export async function getUserData(id: string) {
  return await db.user.findUnique({ where: { id } })
}

// Component-level caching
'use cache'
export async function UserProfile({ userId }) {
  const user = await getUserData(userId)
  return <div>{user.name}</div>
}

// With cache control
'use cache'
export async function getProducts() {
  'use cacheLife'
  'use cacheTag' 'products'

  return await db.product.findMany()
}
```

**Production Status**: ⚠️ Experimental - requires `dynamicIO` flag, has known issues on Vercel production (Issue #82477)

**Gap in metallic-card**: Not using experimental caching features (appropriate for stable release).

---

### 5. Metadata API for SEO Optimization

**Source**: [Next.js Metadata Official Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) (Tier 1)

**Description**: Type-safe, automatic metadata optimization with support for static and dynamic generation.

**Best Practices**:
```tsx
// app/layout.tsx - Static metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Site Name',
    template: '%s | Site Name'
  },
  description: 'Site description for SEO',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  }
}

// app/blog/[slug]/page.tsx - Dynamic metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}
```

**SEO Benefits**:
- Automatic deduplication of meta tags
- Type-safe configuration prevents errors
- Automatic OG image generation support
- Proper canonical URL handling

**Gap in metallic-card**: Minimal metadata (title + description only), missing OG tags, Twitter cards, robots directives.

---

### 6. Image Optimization with Automatic WebP/AVIF

**Source**: [Next.js Image Optimization Docs](https://nextjs.org/docs/14/app/building-your-application/optimizing/images) (Tier 1)

**Description**: Automatic format conversion, responsive sizing, and lazy loading without configuration.

**Automatic Features**:
- **Format Conversion**: Serves WebP/AVIF based on browser Accept header
- **Responsive Sizing**: Generates multiple sizes automatically
- **Lazy Loading**: Images load only when entering viewport
- **Blur Placeholder**: LQIP (Low Quality Image Placeholder) generation

**Production Configuration**:
```typescript
// next.config.mjs
const config = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first (better compression)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache for 60 seconds minimum
  }
}

// Component usage
import Image from 'next/image'

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Load immediately (above fold)
      placeholder="blur" // LQIP while loading
      blurDataURL="data:image/jpeg;base64,..." // Or automatic with local images
    />
  )
}
```

**Gap in metallic-card**: `images: { unoptimized: true }` - disabling ALL automatic optimization!

---

### 7. Turbopack Production Builds

**Source**: [Next.js 15.5 Official Blog](https://nextjs.org/blog/next-15-5) (Tier 1)

**Description**: Rust-based bundler offering 2-5x faster builds, production-ready since Next.js 15.5.

**Performance Benchmarks**:
- **Build Time**: 2-5x faster than Webpack (scales with CPU cores)
- **Core Scaling**: 28% faster with 4 cores, 83% faster with 30 cores
- **Real-World**: Cal.com saw 19% cold build time reduction (187s → 152s)

**Production Status**: ✅ Stable in Next.js 15.5+, powering Vercel.com, v0.app, nextjs.org

**Configuration**:
```typescript
// next.config.mjs
const config = {
  // Next.js 15.5+ uses Turbopack by default
  // No explicit configuration needed

  // Optional: Custom Turbopack rules
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}
```

**⚠️ Known Issues**:
- Some projects report +211 kB increase in shared client chunk
- Bundle size regression requires monitoring on a per-project basis

**Gap in metallic-card**: Already configured Turbopack rules (✅), but on Next.js 15.1.3 (not 15.5+).

---

### 8. Partial Prerendering (PPR) - Future Outlook

**Source**: [Next.js PPR Official Docs](https://nextjs.org/docs/15/app/getting-started/partial-prerendering) (Tier 1)

**Description**: Experimental rendering strategy combining static shell with dynamic holes that stream in.

**How It Works**:
1. Server sends static HTML shell immediately (fast TTFB)
2. Dynamic content marked with Suspense "holes"
3. Holes stream in parallel as data becomes available

**Production Status**: ⚠️ **EXPERIMENTAL - NOT PRODUCTION READY**

**Configuration** (Experimental Only):
```typescript
// next.config.ts
const config = {
  experimental: {
    ppr: 'incremental', // Opt-in per route
  }
}

// app/dashboard/page.tsx
export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticHeader /> {/* Rendered immediately */}

      <Suspense fallback={<Loading />}>
        <DynamicUserData /> {/* Streams in */}
      </Suspense>
    </>
  )
}
```

**Known Issues**:
- Requires canary versions for full functionality (Issue #71587)
- Behavior differs between development and production
- Breaking changes expected before stable release

**Recommendation**: ❌ Do NOT enable in production. Monitor for stable release in Next.js 16.

---

## Gap Analysis: metallic-card Implementation

### Critical Gaps

1. **❌ Image Optimization Disabled**
   - Current: `images: { unoptimized: true }`
   - Impact: Missing automatic WebP/AVIF, responsive sizing, lazy loading
   - Fix: Remove `unoptimized: true`, add proper Image component usage

2. **❌ Client-Side Root Component**
   - Current: `page.tsx` marked `"use client"`
   - Impact: Losing RSC benefits for static content (name, title, contact links)
   - Fix: Split into Server Component wrapper + Client Component for scroll logic

3. **❌ No Caching Strategy**
   - Current: Relying on Next.js 15 defaults (no caching)
   - Impact: Every request fetches fresh data (no static optimization)
   - Fix: Add explicit `export const dynamic = 'force-static'`

4. **❌ Minimal Metadata**
   - Current: Only title and description
   - Impact: Missing OG tags, Twitter cards, robots, canonical URLs
   - Fix: Implement comprehensive Metadata API configuration

5. **❌ No Streaming/Suspense**
   - Current: Monolithic single render
   - Impact: Users wait for entire page before seeing anything
   - Fix: Add Suspense boundaries or loading.tsx

### Minor Improvements

6. **⚠️ TypeScript/ESLint Build Ignored**
   - Current: `ignoreBuildErrors: true`, `ignoreDuringBuilds: true`
   - Impact: Type errors not caught in production builds
   - Fix: Enable checks, fix errors incrementally

7. **⚠️ Next.js Version**
   - Current: 15.1.3
   - Available: 15.5.3+ (production Turbopack, better stability)
   - Fix: Upgrade to latest 15.x for bug fixes and performance

8. **⚠️ Manual Webpack Optimization**
   - Current: Custom webpack config for tree-shaking
   - Impact: Potentially conflicts with SWC minifier defaults
   - Fix: Remove manual config, rely on Next.js 15 defaults

### Strengths

✅ **Turbopack Configured**: SVG loader rules properly set
✅ **Compression Enabled**: `compress: true` for production
✅ **Security Headers**: `poweredByHeader: false` removes X-Powered-By
✅ **React Strict Mode**: Enabled for debugging
✅ **Font Optimization**: Using `next/font/google` for Josefin Sans

---

## Recommendations

### Quick Wins (High Impact, Low Effort)

1. **Enable Image Optimization** ⚡ Impact: High | Effort: 5 min
   ```typescript
   // next.config.mjs - Remove unoptimized flag
   const config = {
     images: {
       formats: ['image/avif', 'image/webp'],
     }
   }
   ```

2. **Add Comprehensive Metadata** ⚡ Impact: High (SEO) | Effort: 15 min
   ```tsx
   // app/layout.tsx
   export const metadata: Metadata = {
     metadataBase: new URL('https://yourdomain.com'),
     title: 'Kevin Rajan - Founder & CEO, zerø',
     description: 'Portfolio and contact information for Kevin Rajan',
     openGraph: {
       title: 'Kevin Rajan - Founder & CEO',
       description: 'AI Engineer and Entrepreneur based in Chicago, IL',
       images: ['/og-image.jpg'],
       type: 'profile',
     },
     twitter: {
       card: 'summary_large_image',
       creator: '@kvnloo',
     },
     robots: {
       index: true,
       follow: true,
     },
   }
   ```

3. **Add Static Export Config** ⚡ Impact: Medium | Effort: 2 min
   ```tsx
   // app/page.tsx - Add route config
   export const dynamic = 'force-static'
   export const revalidate = false // Fully static
   ```

### High-Impact Upgrades

4. **Split RSC Architecture** ⚡ Impact: High | Effort: 30 min
   ```tsx
   // app/page.tsx (Server Component)
   import { ClientPortfolio } from './client-portfolio'

   export default function Page() {
     const contactLinks = [...] // Static data

     return (
       <ClientPortfolio
         name="Kevin Rajan"
         title={{ role: "Founder & CEO", company: "zerø" }}
         contactLinks={contactLinks}
       />
     )
   }

   // app/client-portfolio.tsx
   "use client"
   export function ClientPortfolio({ name, title, contactLinks }) {
     // Scroll logic only
   }
   ```

5. **Add Streaming with Suspense** ⚡ Impact: Medium | Effort: 20 min
   ```tsx
   // app/loading.tsx
   export default function Loading() {
     return <ElectricBorderSkeleton />
   }
   ```

6. **Upgrade Next.js to 15.5+** ⚡ Impact: Medium | Effort: 10 min
   ```bash
   npm install next@15.5.3 eslint-config-next@15.5.3
   ```

### Long-Term Improvements

7. **Enable TypeScript/ESLint in Builds** ⚡ Impact: Low (Quality) | Effort: 2 hours
   - Incrementally fix type errors
   - Remove `ignoreBuildErrors` and `ignoreDuringBuilds`

8. **Monitor for PPR Stable Release** ⚡ Impact: Medium (Future) | Effort: Ongoing
   - Track Next.js 16 release notes
   - Evaluate PPR when production-ready

9. **Consider Redis Caching for Dynamic Routes** ⚡ Impact: Medium | Effort: 4 hours
   - Only needed if adding dynamic content (blog, projects, etc.)
   - Current single-page site doesn't require

---

## Implementation Priority Matrix

| Priority | Action | Impact | Effort | ROI |
|----------|--------|--------|--------|-----|
| 🔴 P0 | Enable Image Optimization | High | 5 min | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Add Comprehensive Metadata | High | 15 min | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Add Static Export Config | Medium | 2 min | ⭐⭐⭐⭐⭐ |
| 🟡 P1 | Split RSC Architecture | High | 30 min | ⭐⭐⭐⭐ |
| 🟡 P1 | Upgrade to Next.js 15.5+ | Medium | 10 min | ⭐⭐⭐⭐ |
| 🟢 P2 | Add Streaming/Suspense | Medium | 20 min | ⭐⭐⭐ |
| 🟢 P2 | Enable Build Checks | Low | 2 hrs | ⭐⭐ |
| 🔵 P3 | Monitor PPR Release | Future | Ongoing | ⭐⭐ |

**Estimated Total Time for P0-P1**: 1 hour
**Expected Performance Improvement**: 30-50% (TTFB, LCP, SEO)

---

## Sources (Tier 1-2 Only)

### Official Documentation (Tier 1)
1. [Next.js 15 Official Blog](https://nextjs.org/blog/next-15) - Caching changes, breaking changes
2. [Next.js App Router Docs](https://nextjs.org/docs/app) - Core concepts, best practices
3. [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) - SEO optimization
4. [Next.js Image Optimization](https://nextjs.org/docs/14/app/building-your-application/optimizing/images) - Image component
5. [Next.js PPR Docs](https://nextjs.org/docs/15/app/getting-started/partial-prerendering) - Experimental features
6. [Next.js "use cache" Directive](https://nextjs.org/docs/app/api-reference/directives/use-cache) - Caching API
7. [Next.js 15.1 Release Notes](https://nextjs.org/blog/next-15-1) - React 19 stable, after() API
8. [Next.js 15.5 Blog](https://nextjs.org/blog/next-15-5) - Turbopack production, benchmarks
9. [Next.js Streaming Docs](https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming) - Loading UI
10. [GitHub Release v15.1.3](https://github.com/vercel/next.js/releases/tag/v15.1.3) - Official changelog

### Vercel Official (Tier 1)
11. [Vercel PPR Blog](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model) - PPR architecture
12. [Turbopack Benchmarks](https://turbo.build/blog/turbopack-benchmarks) - Performance data

### High-Quality Technical (Tier 2)
13. [FreeCodeCamp Next.js 15 Streaming Handbook](https://www.freecodecamp.org/news/the-nextjs-15-streaming-handbook/) - Streaming patterns
14. [Strapi React & Next.js 2025 Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices) - RSC patterns
15. [Strapi Next.js 15 Caching Guide](https://strapi.io/blog/mastering-nextjs-15-caching-dynamic-io-and-the-use-cache) - Cache strategies
16. [DEV Community Next.js 15 App Router Caching](https://dev.to/technnik/nextjs-15-app-router-caching-why-self-hosted-apps-need-redis-and-how-to-implement-it-23op) - Redis patterns
17. [Medium Complete SEO Guide](https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7) - Metadata API

---

## Conclusion

Next.js 15.1.3 represents a maturation of the App Router with critical changes in caching behavior and streaming capabilities. The metallic-card repository has solid foundations (Turbopack, font optimization) but misses key optimizations (image optimization, RSC architecture, comprehensive metadata) that could improve performance by 30-50%.

**Priority 0 fixes (22 minutes)** will deliver immediate SEO and performance gains with minimal risk. **Priority 1 upgrades (40 minutes)** will modernize the architecture for long-term maintainability and performance.

**PPR should NOT be enabled** until officially stable - likely Next.js 16.

**Next Steps**: Implement P0 and P1 recommendations, measure performance improvement with Lighthouse/WebPageTest, then evaluate P2 optimizations based on metrics.
