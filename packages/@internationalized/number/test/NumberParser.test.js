/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {NumberParser} from '../src/NumberParser';

describe('NumberParser', function () {
  describe('parse', function () {
    it('should support basic numbers', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('10')).toBe(10);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-10')).toBe(-10);
    });

    it('should support decimals', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('10.5')).toBe(10.5);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-10.5')).toBe(-10.5);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('.5')).toBe(0.5);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-.5')).toBe(-0.5);
    });

    it('should support group characters', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('1,000')).toBe(1000);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-1,000')).toBe(-1000);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('1,000,000')).toBe(1000000);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-1,000,000')).toBe(-1000000);
    });

    it('should support signDisplay', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('+10')).toBe(10);
      expect(new NumberParser('en-US', {style: 'decimal', signDisplay: 'always'}).parse('+10')).toBe(10);
    });

    it('should support negative numbers with different minus signs', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('-10')).toBe(-10);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('\u221210')).toBe(NaN);

      expect(new NumberParser('fi-FI', {style: 'decimal'}).parse('-10')).toBe(-10);
      expect(new NumberParser('fi-FI', {style: 'decimal'}).parse('\u221210')).toBe(-10);
    });

    it('should return NaN for random characters', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('g')).toBe(NaN);
      expect(new NumberParser('en-US', {style: 'decimal'}).parse('1abc')).toBe(NaN);
    });

    describe('currency', function () {
      it('should parse without the currency symbol', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency'}).parse('10.50')).toBe(10.5);
      });

      it('should ignore currency symbols', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency'}).parse('$10.50')).toBe(10.5);
      });

      it('should ignore currency codes', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'code'}).parse('USD 10.50')).toBe(10.5);
      });

      it('should ignore currency names', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'name'}).parse('10.50 US dollars')).toBe(10.5);
      });

      it('should handle when the currency symbol contains valid number characters', function () {
        expect(new NumberParser('ar-AE', {currency: 'SAR', style: 'currency'}).parse('ر.س.‏ 10.50')).toBe(10.5);
      });

      it('should support accounting format', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencySign: 'accounting'}).parse('(1.50)')).toBe(-1.5);
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencySign: 'accounting'}).parse('($1.50)')).toBe(-1.5);
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'code', currencySign: 'accounting'}).parse('(USD 1.50)')).toBe(-1.5);
      });

      it('should support normal negative numbers in accounting format', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencySign: 'accounting'}).parse('-1.5')).toBe(-1.5);
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencySign: 'accounting'}).parse('-$1.50')).toBe(-1.5);
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'code', currencySign: 'accounting'}).parse('USD -1.50')).toBe(-1.5);
      });

      it('should return NaN for unknown currency symbols', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency'}).parse('€10.50')).toBe(NaN);
      });

      it('should return NaN for unknown currency codes', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'code'}).parse('EUR 10.50')).toBe(NaN);
      });

      it('should return NaN for unknown currency names', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'name'}).parse('10.50 euros')).toBe(NaN);
      });

      it('should return NaN for partial currency codes', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'code'}).parse('EU 10.50')).toBe(NaN);
      });

      it('should return NaN for partial currency names', function () {
        expect(new NumberParser('en-US', {currency: 'USD', style: 'currency', currencyDisplay: 'name'}).parse('10.50 eur')).toBe(NaN);
      });
    });

    describe('units', function () {
      it('should parse with units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).parse('23.5 in')).toBe(23.5);
      });

      it('should parse with narrow units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch', unitDisplay: 'narrow'}).parse('23.5″')).toBe(23.5);
      });

      it('should parse with long units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch', unitDisplay: 'long'}).parse('23.5 inches')).toBe(23.5);
      });

      it('should parse with singular long units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch', unitDisplay: 'long'}).parse('1 inch')).toBe(1);
      });

      it('should return NaN for unknown units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).parse('23.5 ft')).toBe(NaN);
      });

      it('should return NaN for partial units', function () {
        expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).parse('23.5 i')).toBe(NaN);
      });
    });

    describe('percents', function () {
      it('should parse a percent', function () {
        expect(new NumberParser('en-US', {style: 'percent'}).parse('10%')).toBe(0.1);
      });

      it('should parse a percent with decimals', function () {
        expect(new NumberParser('en-US', {style: 'percent'}).parse('10.5%')).toBe(0.1);
        expect(new NumberParser('en-US', {style: 'percent', minimumFractionDigits: 2}).parse('10.5%')).toBe(0.105);
      });
    });
  });

  describe('isValidPartialNumber', function () {
    it('should support basic numbers', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-')).toBe(true);
    });

    it('should support decimals', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('.')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('.5')).toBe(true);

      // Starting with arabic decimal point
      expect(new NumberParser('ar-AE', {style: 'decimal'}).isValidPartialNumber('٫')).toBe(true);
      expect(new NumberParser('ar-AE', {style: 'decimal'}).isValidPartialNumber('٫٥')).toBe(true);

      // Arabic locale, starting with latin decimal point
      expect(new NumberParser('ar-AE', {style: 'decimal'}).isValidPartialNumber('.')).toBe(true);
      expect(new NumberParser('ar-AE', {style: 'decimal'}).isValidPartialNumber('.5')).toBe(true);
    });

    it('should support group characters', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber(',')).toBe(true); // en-US-u-nu-arab uses commas as the decimal point character
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber(',000')).toBe(false); // latin numerals cannot follow arab decimal point
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('1,000')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-1,000')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('1,000,000')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-1,000,000')).toBe(true);
    });

    it('should reject random characters', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('g')).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('1abc')).toBe(false);
    });

    it('should support signDisplay', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('+')).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('+10')).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal', signDisplay: 'always'}).isValidPartialNumber('+')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal', signDisplay: 'always'}).isValidPartialNumber('+10')).toBe(true);
    });

    it('should support negative numbers with different minus signs', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('\u2212')).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('\u221210')).toBe(false);

      expect(new NumberParser('fi-FI', {style: 'decimal'}).isValidPartialNumber('-')).toBe(true);
      expect(new NumberParser('fi-FI', {style: 'decimal'}).isValidPartialNumber('-10')).toBe(true);
      expect(new NumberParser('fi-FI', {style: 'decimal'}).isValidPartialNumber('\u2212')).toBe(true);
      expect(new NumberParser('fi-FI', {style: 'decimal'}).isValidPartialNumber('\u221210')).toBe(true);
    });

    it('should return false for negative numbers if minValue >= 0', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-', 0)).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-', 10)).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('-10', 0)).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('-$', 0)).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('-$1', 0)).toBe(false);
    });

    it('should return false for positive numbers and signDisplay if maxValue < 0', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('+', -10, -5)).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('+', -10, 0)).toBe(false);
      expect(new NumberParser('en-US', {style: 'decimal'}).isValidPartialNumber('+10', -10, -5)).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', signDisplay: 'always'}).isValidPartialNumber('+$', -10, -5)).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', signDisplay: 'always'}).isValidPartialNumber('+$1', -10, -5)).toBe(false);
    });

    it('should support currency', function () {
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('$10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('$10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencyDisplay: 'code'}).isValidPartialNumber('USD 10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencyDisplay: 'code'}).isValidPartialNumber('US 10')).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencyDisplay: 'name'}).isValidPartialNumber('10 US dollars')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencyDisplay: 'name'}).isValidPartialNumber('10 US d')).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD'}).isValidPartialNumber('(')).toBe(false);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('(')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('($10)')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('-')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('-10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('-$10')).toBe(true);

      // typing latin characters in arabic locale should work
      expect(new NumberParser('ar-AE', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('(')).toBe(true);
      expect(new NumberParser('ar-AE', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('(10)')).toBe(true);
      expect(new NumberParser('ar-AE', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('-')).toBe(true);
      expect(new NumberParser('ar-AE', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).isValidPartialNumber('-10')).toBe(true);
    });

    it('should support units', function () {
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10 in')).toBe(true);
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10.5 in')).toBe(true);
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10 i')).toBe(false);
      expect(new NumberParser('en-US', {style: 'unit', unit: 'inch'}).isValidPartialNumber('10.5 i')).toBe(false);
    });

    it('should support percents', function () {
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('10')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('10.5')).toBe(false);
      expect(new NumberParser('en-US', {style: 'percent', minimumFractionDigits: 2}).isValidPartialNumber('10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent', maximumFractionDigits: 2}).isValidPartialNumber('10.5')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('10%')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('10.5%')).toBe(false);
      expect(new NumberParser('en-US', {style: 'percent', minimumFractionDigits: 2}).isValidPartialNumber('10.5%')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent', maximumFractionDigits: 2}).isValidPartialNumber('10.5%')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('%')).toBe(true);
      expect(new NumberParser('en-US', {style: 'percent'}).isValidPartialNumber('10 %')).toBe(true);
    });
  });

  describe('getNumberingSystem', function () {
    it('should return the default numbering system for a locale', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem(' ')).toBe('latn');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('12')).toBe('latn');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('.')).toBe('latn');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('12.5')).toBe('latn');

      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('١٢')).toBe('arab');
      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('٫')).toBe('arab');
      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('١٫٢')).toBe('arab');
    });

    it('should support using non-default numbering systems for a locale', function () {
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('١٢')).toBe('arab');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('٫')).toBe('arab');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('١٫٢')).toBe('arab');

      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('12')).toBe('latn');
      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('.')).toBe('latn');
      expect(new NumberParser('ar-AE', {style: 'decimal'}).getNumberingSystem('12.5')).toBe('latn');

      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('一二')).toBe('hanidec');
      expect(new NumberParser('en-US', {style: 'decimal'}).getNumberingSystem('一二.五')).toBe('hanidec');
    });
  });
});
