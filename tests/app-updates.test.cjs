const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

test('update notice is unique and blocks refresh until changes are saved', async () => {
  const listeners = {};
  const nodes = [];
  let reason = 'Save your changes before updating the app.';
  let reloads = 0;
  const context = {
    URL,
    fetch: async () => ({ ok: true, text: async () => 'latest' }),
    DOMParser: class { parseFromString() { return { querySelector: selector => selector === '#appShell' ? {} : { content: '20261028.02' } }; } },
    window: {
      addEventListener: (name, fn) => { listeners[name] = fn; },
      MarkHubUpdateBlockReason: () => reason,
      confirm: () => true
    },
    navigator: {},
    location: { href: 'http://localhost/index.html', origin: 'http://localhost', replace: url => { assert.ok(url.includes('appRefresh=')); reloads++; } },
    document: {
      querySelector: () => ({ content: '20261028.01' }),
      querySelectorAll: () => [], addEventListener() {},
      createElement: () => ({
        setAttribute() {}, addEventListener(name, fn) { this[name] = fn; },
        remove() { this.removed = true; },
        append(...children) { this.children = children; }
      }),
      body: { appendChild: node => nodes.push(node) }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app-updates.js'), 'utf8'), context);
  listeners['markhub-update-ready']({ detail: {} });
  await new Promise(resolve => setImmediate(resolve));
  listeners['markhub-update-ready']({ detail: {} });
  assert.equal(nodes.length, 1);
  const [message, button] = nodes[0].children;
  button.click();
  assert.equal(reloads, 0);
  assert.equal(message.textContent, reason);
  reason = '';
  button.click();
  assert.equal(reloads, 1);
  assert.equal(nodes[0].removed, true);
  listeners['markhub-update-ready']({ detail: {} });
  assert.equal(nodes.length, 1);
});

test('current page does not show an update for a waiting worker or external scripts', async () => {
  const listeners = {};
  let banners = 0;
  const asset = source => ({ getAttribute: () => source });
  const context = {
    URL,
    location: { href: 'http://localhost/index.html', origin: 'http://localhost' },
    navigator: {},
    window: { addEventListener: (name, fn) => { listeners[name] = fn; } },
    document: {
      querySelector: () => ({ content: '20261028.01' }),
      querySelectorAll: () => [asset('./app.js?v=current'), asset('https://cdn.example.com/pdf.js?v=1')],
      addEventListener() {},
      createElement() { banners++; throw new Error('Unexpected update notice'); }
    },
    fetch: async () => ({ ok: true, text: async () => 'current' }),
    DOMParser: class {
      parseFromString() {
        return { querySelector: selector => selector === '#appShell' ? {} : { content: '20261028.01' }, querySelectorAll: () => [asset('./app.js?v=current')] };
      }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app-updates.js'), 'utf8'), context);
  listeners['markhub-update-ready']({ detail: { waiting: {} } });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(banners, 0);
});
