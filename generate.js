#!/usr/bin/gjs -m

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const control_button_style_options = [
  'circle',
  'square',
  'dash',
  'vertical',
  'slash',
  'back_slash',
];

function _rgba(color) {
  let clr = color || [1, 1, 1, 1];
  let res = clr.map((r) => Math.floor(255 * r));
  res[3] = clr[3].toFixed(1);
  return res.join(',');
}

function _readFile(filename) {
  let fn = Gio.File.new_for_path(filename);
  if (fn.query_exists(null)) {
    try {
      const [success, contents] = fn.load_contents(null);
      const decoder = new TextDecoder();
      let contentsString = decoder.decode(contents);
      return contentsString;
    } catch (err) {}
  }
  return '';
}

function _writeFile(filename, content) {
  let fn = Gio.File.new_for_path(filename);
  const [, etag] = fn.replace_contents(
    content,
    null,
    false,
    Gio.FileCreateFlags.REPLACE_DESTINATION,
    null
  );
}

function _updateWindowControlStyle(params) {
  let {
    control_button_style,
    traffic_light_colors,
    hovered_traffic_light_colors,
    unfocused_traffic_light_colors,
  } = params;
  let { button_color, hovered_button_color, unfocused_button_color } = params;
  let dir = Gio.File.new_for_path('./resources');
  let configDir = GLib.get_home_dir() + '/.config/';
  let button_style =
    control_button_style_options[control_button_style] || 'circle';

  // make dirs
  try {
    Gio.File.new_for_path(`${configDir}`).make_directory_with_parents(null);
  } catch (err) {
    // console.log(err);
  }

  try {
    Gio.File.new_for_path(`${configDir}/gtk-3.0`).make_directory_with_parents(
      null
    );
  } catch (err) {
    // console.log(err);
  }

  try {
    Gio.File.new_for_path(`${configDir}/gtk-4.0`).make_directory_with_parents(
      null
    );
  } catch (err) {
    // console.log(err);
  }

  {
    let gtk3css = _readFile(`${dir.get_path()}/gtk-3.0/gtk.css`);
    _writeFile(`${configDir}/gtk-3.0/gtk.css`, gtk3css);
    let gtk4css = _readFile(`${dir.get_path()}/gtk-4.0/gtk.css`);
    _writeFile(`${configDir}/gtk-4.0/gtk.css`, gtk4css);
  }

  // ['circle', 'square', 'dash', 'vertical', 'slash', 'back_slash']
  let styles = ['dot', 'sq', 'rr', 'rr90', 'rr135', 'rr45'];
  let style = styles[control_button_style] || 'dot';

  let dot = String(_readFile(`${dir.get_path()}/${style}.svg`));
  let doth = String(_readFile(`${dir.get_path()}/${style}h.svg`));

  ['gtk-4.0', 'gtk-3.0'].forEach((gtk) => {
    let maxcolor = `rgba(0,250,0)`;
    let maxcolorh = `rgba(0,250,0)`;
    let maxcolorb = `rgba(0,250,0)`;
    let mincolor = `rgba(255,245,0)`;
    let mincolorh = `rgba(255,245,0)`;
    let mincolorb = `rgba(255,245,0)`;
    let closecolor = `rgba(255,0,0)`;
    let closecolorh = `rgba(255,0,0)`;
    let closecolorb = `rgba(255,0,0)`;

    if (!traffic_light_colors) {
      maxcolor = `rgba(${_rgba(button_color)})`;
      mincolor = `rgba(${_rgba(button_color)})`;
      closecolor = `rgba(${_rgba(button_color)})`;
    }

    if (!hovered_traffic_light_colors) {
      maxcolorh = `rgba(${_rgba(hovered_button_color)})`;
      mincolorh = `rgba(${_rgba(hovered_button_color)})`;
      closecolorh = `rgba(${_rgba(hovered_button_color)})`;
    }

    if (!unfocused_traffic_light_colors) {
      maxcolorb = `rgba(${_rgba(unfocused_button_color)})`;
      mincolorb = `rgba(${_rgba(unfocused_button_color)})`;
      closecolorb = `rgba(${_rgba(unfocused_button_color)})`;
    }

    // max
    {
      let dotcolored = dot.replace('fill="#ffffff"', `fill="${maxcolor}"`);
      let dotcoloredh = doth.replace('fill="#ffffff"', `fill="${maxcolorh}"`);
      let dotcoloredb = doth.replace('fill="#ffffff"', `fill="${maxcolorb}"`);
      _writeFile(`${configDir}/${gtk}/max.svg`, dotcolored);
      _writeFile(`${configDir}/${gtk}/maxh.svg`, dotcoloredh);
      _writeFile(`${configDir}/${gtk}/maxb.svg`, dotcoloredb);
    }

    // min
    {
      let dotcolored = dot.replace('fill="#ffffff"', `fill="${mincolor}"`);
      let dotcoloredh = doth.replace('fill="#ffffff"', `fill="${mincolorh}"`);
      let dotcoloredb = doth.replace('fill="#ffffff"', `fill="${mincolorb}"`);
      _writeFile(`${configDir}/${gtk}/min.svg`, dotcolored);
      _writeFile(`${configDir}/${gtk}/minh.svg`, dotcoloredh);
      _writeFile(`${configDir}/${gtk}/minb.svg`, dotcoloredb);
    }

    // close
    {
      let dotcolored = dot.replace('fill="#ffffff"', `fill="${closecolor}"`);
      let dotcoloredh = doth.replace('fill="#ffffff"', `fill="${closecolorh}"`);
      let dotcoloredb = doth.replace('fill="#ffffff"', `fill="${closecolorb}"`);
      _writeFile(`${configDir}/${gtk}/close.svg`, dotcolored);
      _writeFile(`${configDir}/${gtk}/closeh.svg`, dotcoloredh);
      _writeFile(`${configDir}/${gtk}/closeb.svg`, dotcoloredb);
    }
  });
}

let [ok, contents] = GLib.file_get_contents('./config.json');
if (ok) {
  const decoder = new TextDecoder();
  let contentsString = decoder.decode(contents);
  let config = JSON.parse(contentsString);
  _updateWindowControlStyle(config);
}
