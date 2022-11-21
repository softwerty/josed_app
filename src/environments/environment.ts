// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL_TEMPLATE: 'https://alpha.josed.cl/api',
  URL_TEMPLATE: 'https://alpha.josed.cl',

  // API_URL_TEMPLATE: 'http://138.197.78.193/api',
  // URL_TEMPLATE: 'http://138.197.78.193',
  //   API_URL_TEMPLATE: 'http://127.0.0.1:8000/api',
  // URL_TEMPLATE: 'http://127.0.0.1:8000',

  STORAGE_MANT_KEY: 'storedreqpost',
  TOKEN_KEY: 'tknkeysaymu20211313',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
