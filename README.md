<br/>
<p align="center">
  <h3 align="center">gtk-window-control-style</h3>

  <p align="center">
    Customize GTK window control buttons.
    <br/>
    <br/>
  </p>
</p>

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/icedman)

# install

Simple run at the terminal:

```sh
make
```

Or if you don't have make and do it manually:

```sh
./generate.js
```

# uninstall

```sh
make uninstall
```

Or manually:

```sh
rm -rf ~/.config/gtk-*
```

This will delete all other gtk custom css.

# Options

Edit config.json with your customizations

```json
{
  "control_button_style": 5,  // 0-5   circle, square, dash, vertical, slash, back_slash
  "traffic_light_colors": true, // set true to use traffic light colors, red, yellow, green
  "hovered_traffic_light_colors": true,
  "unfocused_traffic_light_colors": true,
  "button_color": [1,1,1,1], // or set your custom color ing RGBA
  "hovered_button_color": [1,1,0,1],
  "unfocused_button_color": [0.2,0.2,0.2,1]
}
```
