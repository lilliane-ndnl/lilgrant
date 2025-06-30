// React import for hooks
import React from 'react' 

// Environment check helper
const isDevelopment = import.meta.env?.DEV || false

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map()

  static startMark(name: string): void {
    this.marks.set(name, performance.now())
  }

  static endMark(name: string): number | null {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`)
      return null
    }
    
    const duration = performance.now() - startTime
    this.marks.delete(name)
    
    if (isDevelopment) {
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  static measureComponent(name: string) {
    return function <T extends React.ComponentType<any>>(Component: T): T {
      const MeasuredComponent = (props: any) => {
        React.useEffect(() => {
          PerformanceMonitor.startMark(`${name}-render`)
          return () => {
            PerformanceMonitor.endMark(`${name}-render`)
          }
        })

        return React.createElement(Component, props)
      }

      MeasuredComponent.displayName = `Measured(${Component.displayName || Component.name})`
      return MeasuredComponent as T
    }
  }
}

// Debounce utility for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Lazy loading utility for images
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

// Virtual scrolling helper
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  )

  const startIndex = Math.max(0, visibleStart - overscan)
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  }
}

// Memory usage monitoring
export function logMemoryUsage(label: string = 'Memory Usage'): void {
  if (isDevelopment && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log(`📊 ${label}:`, {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
    })
  }
} 