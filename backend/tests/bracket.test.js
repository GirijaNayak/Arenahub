import test from 'node:test';import assert from 'node:assert/strict';
function nextPowerOfTwo(n){let p=1;while(p<n)p*=2;return p}
test('single elimination bracket rounds use a power-of-two size',()=>{assert.equal(nextPowerOfTwo(5),8);assert.equal(nextPowerOfTwo(8),8);assert.equal(nextPowerOfTwo(17),32)});
test('bye count is bracket size minus team count',()=>{assert.equal(nextPowerOfTwo(6)-6,2);assert.equal(nextPowerOfTwo(12)-12,4)});
