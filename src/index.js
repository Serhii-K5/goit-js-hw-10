import './css/styles.css';
import { selection } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputTxt = document.querySelector('#search-box');
const ulCountry = document.querySelector('.country-list');
const divCountry = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

ulCountry.style.paddingLeft = 0;

inputTxt.addEventListener(
  'input',
  debounce(() => {
    const inputValue = inputTxt.value.trim(); //очищення від зайвих пробілів перед та після значення
    cleanFetch();

    if (inputValue !== '') {
      selection(inputValue).then(value => {
        if (value.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (value.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (value.length > 1 && value.length < 11) {
          showFoundCountries(value);
        } else if (value.length === 1) {
          showFoundCountry(value);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function cleanFetch() {
  ulCountry.innerHTML = '';
  divCountry.innerHTML = '';
}

function showFoundCountries(countries) {
  // v1
  // ulCountry.innerHTML = countries
  //   .map(el => {
  //     return `<li style="list-style-type: none;">
  //       <p class='js-selection><img src="${el.flags.svg}" alt="${el.name.official} flag" width="30">
  //         <b>${el.name.official}</b></p>
  //     </li>`;
  //   })
  //   .join('');

  // v2
  // ulCountry.innerHTML = countries.reduce((total, el) => {
  //   const htmlCode = `<li style="list-style-type: none;">
  //       <p class='js-selection'><img src="${el.flags.svg}" alt="${el.name.official} flag" width="30">
  //         <b>${el.name.official}</b></p>
  //     </li>`;
  //   return total + htmlCode;
  // }, '');

  // v3
  ulCountry.innerHTML = countries.reduce((total, el) => {
    const htmlCode = `<li style="list-style-type: none;">
      <p class='js-selection'><img src="${el.flags.svg}" alt="${el.name.official} flag" width="30">
        <b>${el.name.official}</b></p>
    </li>`;
    return total + htmlCode;
  }, '');
}

function showFoundCountry(countries) {
  ulCountry.innerHTML = countries
    .map(el => {
      return `<li>
        <p class='js-font'><img src="${el.flags.svg}" alt="${
        el.name.official
      } flag" width="25">
          <b>${el.name.official}</b>
        </p>        
        <p><b>Capital</b>: ${el.capital}</p>
        <p><b>Population</b>: ${el.population}</p>
        <p><b>Languages</b>: ${Object.values(el.languages)}</p>
      </li>`;
    })
    .join('');

  ulCountry.firstChild.style.listStyleType = 'none';

  const newSize = ulCountry.querySelector('.js-font');
  newSize.style.fontSize = '32px';
}

// EN: List element selection block
// UA: Блок вибору елементів зі списку
function getPosition(e) {
  let x = (y = 0);

  if (!e) {
    const e = window.event;
  }

  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else if (e.clientX || e.clientY) {
    x =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    y =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { x: x, y: y };
}

function pos(e) {
  const elem = document.elementFromPoint(e.pageX, e.pageY);
  try {
    if (elem.parentElement.className !== 'js-selection') {
      return;
    };
  } catch {return;}

  let inputValue;
  if (elem.tagName === 'B') {
    inputValue = (inputTxt.value = elem.textContent);
  } else if (elem.tagName === 'IMG') {
    inputValue = inputTxt.value = elem.nextElementSibling.textContent;
  };
  
  cleanFetch();

  selection(inputValue).then(value => {
    showFoundCountry(value);
  });
}

addEventListener('mousemove', pos, false);
  
// EN: End of list element selection block  
// UA: Кінець блоку вибору елементів зі списку
