const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

test('update notice is unique and blocks refresh until changes are saved', () => {
  const listeners = {};
  const nodes = [];
  let reason = 'Save your changes before updating the app.';
  let reloads = 0;
  const context = {
    window: {
      addEventListener: (name, fn) => { listeners[name] = fn; },
      MarkHubUpdateBlockReason: () => reason,
      confirm: () => true
    },
    navigator: {},
    location: { reload: () => { reloads++; } },
    document: {
      querySelectorAll: () => [], addEventListener() {},
      createElement: () => ({
        setAttribute() {}, addEventListener(name, fn) { this[name] = fn; },
        append(...children) { this.children = children; }
      }),
      body: { appendChild: node => nodes.push(node) }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app-updates.js'), 'utf8'), context);
  listeners['markhub-update-ready']({ detail: {} });
  listeners['markhub-update-ready']({ detail: {} });
  assert.equal(nodes.length, 1);
  const [message, button] = nodes[0].children;
  button.click();
  assert.equal(reloads, 0);
  assert.equal(message.textContent, reason);
  reason = '';
  button.click();
  assert.equal(reloads, 1);
});
