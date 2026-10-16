import test from 'node:test';
import assert from 'node:assert/strict';
test('intentional disposable CI gate failure',()=>assert.fail('Expected gate verification failure; this branch must never merge.'));
