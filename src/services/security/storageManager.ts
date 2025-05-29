
const SECURE_ID_MAP_KEY = 'secure_id_map';
const REVERSE_MAP_KEY = 'reverse_map';
const STATIC_ROUTES_KEY = 'static_secure_routes';

export class StorageManager {
  private static instance: StorageManager;
  private secureIdMap: Map<string, string>;
  private reverseMap: Map<string, string>;
  private staticSecureRoutes: Map<string, string>;

  private constructor() {
    this.secureIdMap = new Map();
    this.reverseMap = new Map();
    this.staticSecureRoutes = new Map();
    this.loadMappings();
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private loadMappings(): void {
    try {
      const savedSecureIdMap = localStorage.getItem(SECURE_ID_MAP_KEY);
      const savedReverseMap = localStorage.getItem(REVERSE_MAP_KEY);
      const savedStaticRoutes = localStorage.getItem(STATIC_ROUTES_KEY);
      
      if (savedSecureIdMap) {
        this.secureIdMap = new Map(JSON.parse(savedSecureIdMap));
      }
      if (savedReverseMap) {
        this.reverseMap = new Map(JSON.parse(savedReverseMap));
      }
      if (savedStaticRoutes) {
        this.staticSecureRoutes = new Map(JSON.parse(savedStaticRoutes));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des mappings sécurisés:', error);
    }
  }

  public saveMappings(): void {
    try {
      localStorage.setItem(SECURE_ID_MAP_KEY, JSON.stringify(Array.from(this.secureIdMap.entries())));
      localStorage.setItem(REVERSE_MAP_KEY, JSON.stringify(Array.from(this.reverseMap.entries())));
      localStorage.setItem(STATIC_ROUTES_KEY, JSON.stringify(Array.from(this.staticSecureRoutes.entries())));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des mappings sécurisés:', error);
    }
  }

  public setMapping(realId: string, secureId: string): void {
    this.secureIdMap.set(realId, secureId);
    this.reverseMap.set(secureId, realId);
    this.saveMappings();
  }

  public getSecureId(realId: string): string | undefined {
    return this.secureIdMap.get(realId);
  }

  public getRealId(secureId: string): string | undefined {
    return this.reverseMap.get(secureId);
  }

  public setStaticRoute(realRoute: string, secureRoute: string): void {
    this.staticSecureRoutes.set(realRoute, secureRoute);
    this.reverseMap.set(secureRoute.substring(1), realRoute);
    this.saveMappings();
  }

  public getStaticSecureRoute(realRoute: string): string | undefined {
    return this.staticSecureRoutes.get(realRoute);
  }

  public clearAll(): void {
    const routesToKeep = new Map<string, string>();
    
    this.staticSecureRoutes.forEach((realRoute, secureRoute) => {
      routesToKeep.set(secureRoute, realRoute);
    });
    
    this.secureIdMap.clear();
    this.reverseMap.clear();
    
    routesToKeep.forEach((realRoute, secureRoute) => {
      this.reverseMap.set(secureRoute, realRoute);
    });
    
    this.saveMappings();
  }

  public hasSecureId(secureId: string): boolean {
    return this.reverseMap.has(secureId);
  }
}
