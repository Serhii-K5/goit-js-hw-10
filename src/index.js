import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputTxt = document.querySelector('#search-box');
const ulCountry = document.querySelector('.country-list');
const divCountry = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
