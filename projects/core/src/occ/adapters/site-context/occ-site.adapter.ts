import { SiteAdapter } from '../../../site-context/connectors/site.adapter';
import { Observable, throwError } from 'rxjs';
import { Currency, Language } from '../../../model/misc.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { catchError, map } from 'rxjs/operators';
import { Occ } from '../../occ-models/occ.models';
import { ConverterService } from '../../../util/converter.service';
import { Country, Region } from '../../../model/address.model';
import {
  COUNTRY_NORMALIZER,
  REGION_NORMALIZER,
} from '../../../user/connectors/payment/converters';
import {
  CURRENCY_NORMALIZER,
  LANGUAGE_NORMALIZER,
} from '../../../site-context/connectors/converters';

const COUNTRIES_ENDPOINT = 'countries';
const REGIONS_ENDPOINT = 'regions';
const COUNTRIES_TYPE_BILLING = 'BILLING';
const COUNTRIES_TYPE_SHIPPING = 'SHIPPING';

@Injectable()
export class OccSiteAdapter implements SiteAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  loadLanguages(): Observable<Language[]> {
    return this.http
      .get<Occ.LanguageList>(this.occEndpoints.getEndpoint('languages'))
      .pipe(
        catchError((error: any) => throwError(error.json())),
        map(languageList => languageList.languages),
        this.converter.pipeableMany(LANGUAGE_NORMALIZER)
      );
  }

  loadCurrencies(): Observable<Currency[]> {
    return this.http
      .get<Occ.CurrencyList>(this.occEndpoints.getEndpoint('currencies'))
      .pipe(
        catchError((error: any) => throwError(error.json())),
        map(currencyList => currencyList.currencies),
        this.converter.pipeableMany(CURRENCY_NORMALIZER)
      );
  }

  loadBillingCountries(): Observable<Country[]> {
    return this.http
      .get<Occ.CountryList>(this.occEndpoints.getEndpoint(COUNTRIES_ENDPOINT), {
        params: new HttpParams().set('type', COUNTRIES_TYPE_BILLING),
      })
      .pipe(
        catchError((error: any) => throwError(error.json())),
        map(countryList => countryList.countries),
        this.converter.pipeableMany(COUNTRY_NORMALIZER)
      );
  }

  loadDeliveryCountries(): Observable<Country[]> {
    return this.http
      .get<Occ.CountryList>(this.occEndpoints.getEndpoint(COUNTRIES_ENDPOINT), {
        params: new HttpParams().set('type', COUNTRIES_TYPE_SHIPPING),
      })
      .pipe(
        catchError((error: any) => throwError(error.json())),
        map(countryList => countryList.countries),
        this.converter.pipeableMany(COUNTRY_NORMALIZER)
      );
  }

  loadRegions(countryIsoCode: string): Observable<Region[]> {
    const regionsEndpoint = `${COUNTRIES_ENDPOINT}/${countryIsoCode}/${REGIONS_ENDPOINT}`;
    return this.http
      .get<Occ.RegionList>(this.occEndpoints.getEndpoint(regionsEndpoint))
      .pipe(
        catchError((error: any) => throwError(error.json())),
        map(regionList => regionList.regions),
        this.converter.pipeableMany(REGION_NORMALIZER)
      );
  }
}
