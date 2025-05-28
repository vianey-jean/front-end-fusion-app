
/**
 * Service de métriques de performance
 * Collecte et analyse les métriques de performances web vitales
 */

// Types pour les métriques de performance
interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceData {
  metrics: PerformanceMetric[];
  timestamp: number;
  url: string;
  userAgent: string;
}

// Seuils pour les métriques Web Vitals
const thresholds = {
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTI: { good: 3800, poor: 7300 }, // Time to Interactive
};

// Vérifier si le navigateur prend en charge les API de Performance
const supportsPerformanceAPI = () => {
  return Boolean(
    window.performance &&
    window.performance.getEntries &&
    window.PerformanceObserver
  );
};

// Obtenir le rating d'une métrique basé sur les seuils
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = thresholds[name as keyof typeof thresholds] || { good: 0, poor: 0 };
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Collecte des métriques principales
export const collectCoreWebVitals = (): Promise<PerformanceMetric[]> => {
  return new Promise((resolve) => {
    if (!supportsPerformanceAPI()) {
      console.log("Performance APIs not supported");
      resolve([]);
      return;
    }

    const metrics: PerformanceMetric[] = [];
    let remainingMetrics = 4;
    
    const finishCollection = () => {
      remainingMetrics--;
      if (remainingMetrics <= 0) {
        resolve(metrics);
      }
    };

    // FCP (First Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0] as PerformanceEntry;
        metrics.push({
          name: 'FCP',
          value: fcp.startTime,
          rating: getRating('FCP', fcp.startTime),
        });
      }
      finishCollection();
    }).observe({ type: 'paint', buffered: true });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lcp = entries[entries.length - 1] as PerformanceEntry;
        metrics.push({
          name: 'LCP',
          value: lcp.startTime,
          rating: getRating('LCP', lcp.startTime),
        });
      }
      finishCollection();
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fid = entries[0] as PerformanceEventTiming;
        metrics.push({
          name: 'FID',
          value: fid.processingStart - fid.startTime,
          rating: getRating('FID', fid.processingStart - fid.startTime),
        });
      }
      finishCollection();
    }).observe({ type: 'first-input', buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          const clsEntry = entry as any;
          clsValue += clsEntry.value;
        }
      }
      
      metrics.push({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
      });
      finishCollection();
    }).observe({ type: 'layout-shift', buffered: true });
    
    // En cas d'expiration de la collection
    setTimeout(() => {
      if (remainingMetrics > 0) {
        console.log(`Metrics collection timed out, returning ${metrics.length} metrics`);
        resolve(metrics);
      }
    }, 10000);
  });
};

// Collecter et enregistrer les métriques
export const recordPerformanceMetrics = async () => {
  if (!supportsPerformanceAPI()) return;
  
  // Attendre que la page soit complètement chargée
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      setTimeout(async () => {
        const metrics = await collectCoreWebVitals();
        logPerformanceData(metrics);
      }, 3000); // Attendre 3s après chargement pour une meilleure précision
    });
  } else {
    const metrics = await collectCoreWebVitals();
    logPerformanceData(metrics);
  }
};

// Logger les données de performance
const logPerformanceData = (metrics: PerformanceMetric[]) => {
  const performanceData: PerformanceData = {
    metrics,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
  
  // Journalisation locale pour le développement
  console.log('Performance metrics:', performanceData);
  
  // Stockage des métriques en local pour analyse future
  try {
    const storedMetrics = localStorage.getItem('performance_metrics');
    const allMetrics = storedMetrics ? JSON.parse(storedMetrics) : [];
    allMetrics.push(performanceData);
    
    // Garder seulement les 20 dernières entrées
    if (allMetrics.length > 20) {
      allMetrics.shift();
    }
    
    localStorage.setItem('performance_metrics', JSON.stringify(allMetrics));
  } catch (e) {
    console.error('Failed to store performance metrics:', e);
  }
  
  // Ici, on pourrait envoyer les données à un service analytics
  // (désactivé par défaut pour respecter la vie privée)
};

// Initialiser le monitoring des performances
export const initPerformanceMonitoring = () => {
  recordPerformanceMetrics();
  
  // Monitoring des ressources lentes
  if (supportsPerformanceAPI()) {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        // Identifier les ressources lentes (>2s de chargement)
        if (entry.duration > 2000) {
          console.warn('Slow resource:', entry.name, `(${Math.round(entry.duration)}ms)`);
        }
      });
    }).observe({ type: 'resource', buffered: true });
  }
};
