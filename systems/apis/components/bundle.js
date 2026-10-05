/* @ds-bundle: {"format":4,"namespace":"Apis","components":[{"name":"Button"},{"name":"Badge"},{"name":"TextField"},{"name":"Checkbox"},{"name":"Switch"},{"name":"Alert"},{"name":"Card"},{"name":"Tabs"},{"name":"DataTable"},{"name":"EmptyState"},{"name":"EnvironmentBanner"},{"name":"Icon"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  var uid = 0; function useId(given) { var r = React.useRef(null); if (!r.current) r.current = given || ('ap-' + (++uid)); return r.current; }

  /* Icons: 24px grid, 2px stroke, round caps and joins, 2px optical padding. Named by what they show. */
  var PATHS = {
    'circle-info': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 16v-5', 'M12 8h.01'],
    'circle-check': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm8 12 3 3 5-6'],
    'triangle-alert': ['M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z', 'M12 9v4', 'M12 17h.01'],
    'octagon-x': ['M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9Z', 'm15 9-6 6', 'm9 9 6 6'],
    'hexagon': ['M12 2.5 20.5 7.3v9.4L12 21.5l-8.5-4.8V7.3Z'],
    'hexagon-plus': ['M12 2.5 20.5 7.3v9.4L12 21.5l-8.5-4.8V7.3Z', 'M12 8.5v7', 'M8.5 12h7'],
    'arrow-right': ['M5 12h14', 'm13 6 6 6-6 6'],
    'plus': ['M12 5v14', 'M5 12h14'],
    'search': ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.3-4.3'],
    'download': ['M12 3v12', 'm7 10 5 5 5-5', 'M5 21h14']
  };
  function Icon(p) {
    var d = PATHS[p.name] || PATHS.hexagon, size = p.size || 24;
    return h('svg', { className: p.className, width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': p.label ? undefined : true, role: p.label ? 'img' : undefined, 'aria-label': p.label },
      d.map(function (x, i) { return h('path', { key: i, d: x }); }));
  }

  function Button(p) {
    var variant = p.variant || 'secondary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'iconStart', 'iconEnd', 'loading', 'className', 'children', 'href', 'disabled']);
    var inner = [
      p.loading ? h('span', { key: 's', className: 'ap-spinner', 'aria-hidden': true }) : (p.iconStart ? h(Icon, { key: 'i', name: p.iconStart }) : null),
      h('span', { key: 'l' }, p.children),
      p.iconEnd ? h(Icon, { key: 'e', name: p.iconEnd }) : null
    ];
    var cls = cx('ap-btn', 'ap-btn--' + variant, size !== 'md' && 'ap-btn--' + size, p.className);
    if (p.href) return h('a', Object.assign({ className: cls, href: p.href }, rest), inner);
    return h('button', Object.assign({ type: 'button', className: cls, 'aria-busy': p.loading || undefined, disabled: p.disabled || p.loading }, rest), inner);
  }

  var TONE_ICON = { info: 'circle-info', success: 'circle-check', warning: 'triangle-alert', danger: 'octagon-x' };
  function Badge(p) {
    var tone = p.tone || 'neutral';
    return h('span', { className: cx('ap-badge', 'ap-badge--' + tone, p.className) },
      p.icon && TONE_ICON[tone] ? h(Icon, { name: TONE_ICON[tone] }) : null, p.children);
  }

  function TextField(p) {
    var id = useId(p.id), hintId = id + '-hint', errId = id + '-err';
    var rest = omit(p, ['label', 'hint', 'error', 'id', 'multiline', 'className', 'optionalLabel']);
    var describedBy = cx(p.hint && hintId, p.error && errId) || undefined;
    var control = h(p.multiline ? 'textarea' : 'input', Object.assign({ id: id, className: 'ap-input', 'aria-invalid': p.error ? true : undefined, 'aria-describedby': describedBy }, rest));
    return h('div', { className: cx('ap-field', p.className) },
      h('label', { className: 'ap-label', htmlFor: id }, p.label, p.required ? h('span', { className: 'ap-req', 'aria-hidden': true }, '*') : null),
      p.hint ? h('span', { id: hintId, className: 'ap-hint' }, p.hint) : null,
      control,
      p.error ? h('span', { id: errId, className: 'ap-error-text' }, h(Icon, { name: 'octagon-x' }), p.error) : null);
  }

  function Checkbox(p) {
    var id = useId(p.id), rest = omit(p, ['label', 'hint', 'id', 'className']);
    return h('label', { className: cx('ap-check', p.className), htmlFor: id },
      h('input', Object.assign({ id: id, type: 'checkbox', 'aria-describedby': p.hint ? id + '-hint' : undefined }, rest)),
      h('span', { className: 'ap-check__text' }, p.label),
      p.hint ? h('span', { id: id + '-hint', className: 'ap-check__hint' }, p.hint) : null);
  }

  function Switch(p) {
    var controlled = p.checked !== undefined;
    var st = React.useState(!!p.defaultChecked), on = controlled ? p.checked : st[0];
    function toggle() { if (!controlled) st[1](!on); if (p.onChange) p.onChange(!on); }
    return h('button', { type: 'button', role: 'switch', 'aria-checked': on, className: cx('ap-switch', p.className), onClick: toggle, disabled: p.disabled, id: p.id },
      h('span', { className: 'ap-switch__track', 'aria-hidden': true }, h('span', { className: 'ap-switch__thumb' })),
      h('span', null, p.label));
  }

  var TONE_WORD = { info: 'Informazione', success: 'Fatto', warning: 'Attenzione', danger: 'Errore' };
  function Alert(p) {
    var tone = p.tone || 'info';
    return h('div', { className: cx('ap-alert', 'ap-alert--' + tone, p.className), role: tone === 'danger' || tone === 'warning' ? 'alert' : 'status' },
      h(Icon, { name: TONE_ICON[tone], className: 'ap-alert__icon', label: TONE_WORD[tone] }),
      h('p', { className: 'ap-alert__title' }, p.title),
      p.children ? h('p', { className: 'ap-alert__body' }, p.children) : null,
      p.action ? h('div', { className: 'ap-alert__action' }, p.action) : null);
  }

  function Card(p) {
    var tag = p.href ? 'a' : (p.as || 'article');
    return h(tag, { className: cx('ap-card', p.href && 'ap-card--interactive', p.className), href: p.href },
      p.eyebrow ? h('p', { className: 'ap-card__eyebrow' }, p.eyebrow) : null,
      p.title ? h(p.titleAs || 'h3', { className: 'ap-card__title' }, p.title) : null,
      p.children ? h('div', { className: 'ap-card__body' }, p.children) : null,
      p.footer ? h('div', { className: 'ap-card__footer' }, p.footer) : null);
  }

  function Tabs(p) {
    var items = p.items || [], base = useId(p.id);
    var controlled = p.value !== undefined;
    var st = React.useState(p.defaultValue || (items[0] && items[0].id)), cur = controlled ? p.value : st[0];
    function select(id) { if (!controlled) st[1](id); if (p.onChange) p.onChange(id); }
    function onKey(e) {
      var i = items.findIndex(function (t) { return t.id === cur; }), n = items.length, j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); select(items[j].id); var el = document.getElementById(base + '-tab-' + items[j].id); if (el) el.focus(); }
    }
    var active = items.find(function (t) { return t.id === cur; });
    return h('div', { className: p.className },
      h('div', { className: 'ap-tabs', role: 'tablist', 'aria-label': p.label, onKeyDown: onKey },
        items.map(function (t) {
          var sel = t.id === cur;
          return h('button', { key: t.id, id: base + '-tab-' + t.id, role: 'tab', type: 'button', className: 'ap-tab', 'aria-selected': sel, 'aria-controls': base + '-panel', tabIndex: sel ? 0 : -1, onClick: function () { select(t.id); } }, t.label);
        })),
      active && active.content !== undefined ? h('div', { id: base + '-panel', role: 'tabpanel', className: 'ap-tabpanel', 'aria-labelledby': base + '-tab-' + cur, tabIndex: 0 }, active.content) : null);
  }

  function DataTable(p) {
    var cols = p.columns || [], rows = p.rows || [];
    return h('div', { className: cx('ap-table-wrap', p.className), tabIndex: p.scrollable ? 0 : undefined, role: p.scrollable ? 'region' : undefined, 'aria-label': p.scrollable ? p.caption : undefined },
      h('table', { className: cx('ap-table', p.density === 'compact' && 'ap-table--compact') },
        p.caption ? h('caption', null, p.caption) : null,
        h('thead', null, h('tr', null, cols.map(function (c) { return h('th', { key: c.key, scope: 'col', className: c.numeric ? 'is-num' : undefined }, c.label); }))),
        h('tbody', null, rows.map(function (r, i) {
          return h('tr', { key: r.id || i }, cols.map(function (c) {
            var v = r[c.key];
            return h('td', { key: c.key, className: c.numeric ? 'is-num' : undefined }, c.render ? c.render(v, r) : v);
          }));
        }))));
  }

  function EmptyState(p) {
    return h('div', { className: cx('ap-empty', p.className) },
      h(Icon, { name: p.icon || 'hexagon-plus', className: 'ap-empty__icon' }),
      h(p.titleAs || 'h3', { className: 'ap-empty__title' }, p.title),
      p.description ? h('p', { className: 'ap-empty__text' }, p.description) : null,
      p.action ? h('div', { className: 'ap-empty__action' }, p.action) : null);
  }

  var ENV = { development: 'Sviluppo', staging: 'Test', preview: 'Anteprima' };
  function EnvironmentBanner(p) {
    var env = p.env || 'staging';
    return h('div', { className: cx('ap-envbar', p.className), role: 'note', 'aria-label': 'Ambiente: ' + (p.label || ENV[env] || env) },
      h('span', { className: 'ap-envbar__label' }, h(Icon, { name: 'triangle-alert', size: 14 }), p.label || ENV[env] || env));
  }

  window.Apis = Object.assign(window.Apis || {}, { Button: Button, Badge: Badge, TextField: TextField, Checkbox: Checkbox, Switch: Switch, Alert: Alert, Card: Card, Tabs: Tabs, DataTable: DataTable, EmptyState: EmptyState, EnvironmentBanner: EnvironmentBanner, Icon: Icon });
})();
