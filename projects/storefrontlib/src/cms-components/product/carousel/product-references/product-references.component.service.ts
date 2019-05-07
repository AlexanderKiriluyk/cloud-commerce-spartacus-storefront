import { Injectable } from '@angular/core';
import {
  CmsProductReferencesComponent,
  ProductReferenceService,
  RoutingService,
  UIProductReference,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';

@Injectable()
export class ProductReferencesService {
  private title$: Observable<string>;
  private items$: Observable<UIProductReference[]>;

  constructor(
    protected component: CmsComponentData<CmsProductReferencesComponent>,
    private referenceService: ProductReferenceService,
    private routerService: RoutingService
  ) {}

  getTitle(): Observable<string> {
    return this.title$;
  }

  setTitle(): void {
    this.title$ = this.component.data$.pipe(
      map(data => {
        return data.title;
      })
    );
  }

  // getReferenceType(): Observable<string> {
  //   return this.component.data$.pipe(
  //     map(data => {
  //       return data.productReferenceTypes;
  //     })
  //   );
  // }

  // getProductCode(): Observable<string> {
  //   return this.referenceType$ = this.routerService.getRouterState().pipe(
  //     map(data =>
  //        data.state.params.productCode
  //     )
  //   );
  // }

  getReferenceType(): Observable<string> {
    return this.component.data$.pipe(map(data => data.productReferenceTypes));
  }

  getProductCode(): Observable<string> {
    return this.routerService
      .getRouterState()
      .pipe(map(data => data.state.params.productCode));
  }

  getReferenceList(): Observable<UIProductReference[]> {
    return this.items$;
  }

  setReferenceList(pageSize?: number): void {
    this.items$ = this.getProductCode().pipe(
      switchMap((productCode: string) => {
        return this.referenceService.get(productCode, '', pageSize);
      })
    );

    // TODO: merge or combine 2 observables for monday
    // this.items$ = this.getReferenceType().pipe(
    //   switchMap((referenceType: string) => {
    //     console.log('what am i ', referenceType);
    //     return this.referenceService.get('358639', referenceType, pageSize);
    //   })
    // );
    // this.items$ = combineLatest(
    //   this.getProductCode,
    //   this.getReferenceType
    // ).pipe(
    //   map(data => ({ productCode: data[0], referenceType: data[1] })),
    //   debounceTime(0),
    //   switchMap(data => {
    //     return this.referenceService.get(
    //       data.productCode,
    //       data.referenceType,
    //       pageSize
    //     );
    //   })
    // );

    // const combined$ = combineLatest(this.getProductCode, this.getReferenceType);

    // this.items$ = combineLatest(
    //   this.getProductCode,
    //   this.getReferenceType
    // ).pipe(
    //   map(data => ({ productCode: data[0], referenceType: data[1] })),
    //   switchMap(result => {
    //     return this.referenceService.get(
    //       result.productCode,
    //       result.referenceType,
    //       pageSize
    //     );
    //   })
    // );
  }
}