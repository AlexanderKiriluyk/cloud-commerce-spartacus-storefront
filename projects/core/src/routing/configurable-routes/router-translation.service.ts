import { Injectable, Injector } from '@angular/core';
import { Routes, Router, Route } from '@angular/router';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutingConfigService } from './routing-config.service';

type ConfigurableRouteKey = 'cxPath' | 'cxRedirectTo';

@Injectable()
export class RouterTranslationService {
  constructor(
    private config: ServerConfig,
    private injector: Injector,
    private routingConfigService: RoutingConfigService
  ) {}

  private initCalled = false; // guard not to call init() more than once

  /**
   * Initializes service with given translations and translates all existing Routes in the Router.
   */
  async init(): Promise<void> {
    if (!this.initCalled) {
      this.initCalled = true;
      await this.routingConfigService.init();
      this.translateRouter();
    }
  }

  private translateRouter() {
    // Router could not be injected in constructor due to cyclic dependency with APP_INITIALIZER:
    const router = this.injector.get(Router);

    const translatedRoutes = this.translateRoutes(router.config);

    router.resetConfig(translatedRoutes);
  }

  private translateRoutes(routes: Routes): Routes {
    const result = [];
    routes.forEach(route => {
      const translatedRouteAliases = this.translateRoute(route);
      if (route.children && route.children.length) {
        const translatedChildrenRoutes = this.translateRoutes(route.children);

        translatedRouteAliases.forEach(translatedRouteAlias => {
          translatedRouteAlias.children = translatedChildrenRoutes;
        });
      }
      result.push(...translatedRouteAliases);
    });
    return result;
  }

  private translateRoute(route: Route): Routes {
    if (this.isConfigurable(route, 'cxPath')) {
      // we assume that 'path' and 'redirectTo' cannot be both configured for one route
      if (this.isConfigurable(route, 'cxRedirectTo')) {
        this.warn(
          `A path should not have set both "cxPath" and "cxRedirectTo" properties! Route: '${route}`
        );
      }
      return this.translateRoutePath(route);
    }

    if (this.isConfigurable(route, 'cxRedirectTo')) {
      return this.translateRouteRedirectTo(route);
    }

    return [route]; // if nothing is configurable, just pass the original route
  }

  private isConfigurable(route: Route, key: ConfigurableRouteKey): boolean {
    return !!this.getConfigurable(route, key);
  }

  private getConfigurable(route: Route, key: ConfigurableRouteKey): string {
    return route.data && route.data[key];
  }

  private translateRoutePath(route: Route): Route[] {
    return this.getTranslatedPaths(route, 'cxPath').map(translatedPath => {
      return { ...route, path: translatedPath };
    });
  }

  private translateRouteRedirectTo(route: Route): Route[] {
    const translatedPaths = this.getTranslatedPaths(route, 'cxRedirectTo');
    return translatedPaths.length
      ? [{ ...route, redirectTo: translatedPaths[0] }] // take the first path from list by convention
      : [];
  }

  private getTranslatedPaths(
    route: Route,
    key: ConfigurableRouteKey
  ): string[] {
    const routeName = this.getConfigurable(route, key);
    const translation = this.routingConfigService.getRouteTranslation(
      routeName
    );
    if (translation === undefined) {
      this.warn(
        `Could not translate key '${key}' of route '${routeName}'`,
        route,
        `due to undefined key '${routeName}' in routes translations`
      );
      return [];
    }
    if (translation && translation.paths === undefined) {
      this.warn(
        `Could not translate key '${key}' of route '${routeName}'`,
        route,
        `due to undefined 'paths' key for '${routeName}' route in routes translations`
      );
      return [];
    }

    // translation or translation.paths can be null - which means switching off the route
    return (translation && translation.paths) || [];
  }

  private warn(...args) {
    if (!this.config.production) {
      console.warn(...args);
    }
  }
}