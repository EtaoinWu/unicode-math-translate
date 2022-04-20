import { Translator } from '../index';
test('Basic Translation', () => {
  let t = new Translator();
  expect(t.translate('\\sum')).toEqual('∑');
  expect(t.translate('\\rho')).toEqual('ρ');
  expect(t.translate('\\vartheta')).toEqual('ϑ');
  expect(t.translate('\\sqrt')).toEqual('√');
  expect(t.translate('\\naryand')).toEqual('▒');
  expect(t.translate('\\all')).toEqual('∀');
  expect(t.translate('\\forall')).toEqual('∀');
  expect(t.translate('\\atop')).toEqual('¦');
});

test('Neg-Relationship Translation', () => {
  let t = new Translator();
  expect(t.translate('/=')).toEqual('≠');
  expect(t.translate('/<=')).toEqual('≰');
  expect(t.translate('/\\approx')).toEqual('≉');
  expect(t.translate('/\\in')).toEqual('∉');
});

test('Font Translation', () => {
  let t = new Translator();
  expect(t.translate('\\_114')).toEqual('₁₁₄');
  expect(t.translate('\\^278')).toEqual('²⁷⁸');
  expect(t.translate('\\frakturX')).toEqual('𝔛');
  expect(t.translate('\\script:ABC')).toEqual('𝒜ℬ𝒞');
});

test('Feature enabling (bigTable)', () => {
  let t0 = new Translator({ disable: ['bigTable'] });
  let t1 = new Translator();
  expect(t0.translate('\\:kitchen-knife')).toBeNull();
  expect(t1.translate('\\:kitchen-knife')).toEqual('🔪');
});

test('Custom Translation', () => {
  let t0 = new Translator();
  let t1 = new Translator({ customCode: { '\\qaq': '好耶！' } });
  expect(t0.translate('\\qaq')).toBeNull();
  expect(t1.translate('\\qaq')).toEqual('好耶！');
});

test('Custom Alias', () => {
  let t0 = new Translator();
  let t1 = new Translator({ customAlias: { '\\yay': '\\:kitchen-knife' } });
  expect(t0.translate('\\yay')).toBeNull();
  expect(t1.translate('\\yay')).toEqual('🔪');
});
