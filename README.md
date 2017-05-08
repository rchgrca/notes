## Relay Rides coding exercise

* single page application created with ReactJS
* http://rchgrca.io/notes/
* https://github.com/rchgrca/notes
* uses "Functional CSS" approach
  * Basscss CSS library (tiny)
  * uses "CSS composition" (overloading class attributes with several classnames)
  * only 2 lines of custom CSS written
    * font-family
    * text-transform: capitalize to account for format in API response
* npm/webpack/babel to bundle JS dependencies
* takes advantage of ES6 features
* axios library for async promises
* takes advantages of CORS proxy to get past cross domain XMLHttpRequests
  * http://crossorigin.me
  * http://hotwire.herokuapp.com
* creation of 3 separate, re-usable, stateful React components
* uses React approach to form submission (mutate state onChange)
* form validation and error handling via API response
  * tricky because JSON format is different when Errors are present
* optimized for mobile browsers via responsive design, grid layout
