# vite-spine-dynamic-url

This plugin automatically replaces the URL of images in the atlas file with the dynamic url of the image generated by Vite.

## Why

When using Spine in Vite, the URL of the image in the atlas file is not replaced with a dynamic URL, which will cause the image to fail to load.

## Install

```bash
npm i vite-spine-dynamic-url --save-dev
```

## Usage

Configure the plugin in `vite.config.js`:

```js
// vite.config.js

import spineDynamicUrl from 'vite-spine-dynamic-url'

export default {
    plugins: [
        atlasDynamicUrl({ atlasInclude: "src/spines/**/*.atlas" }),
    ]
}
```

When loading a Spine data you should import it using the `import` or URL syntax so Vite can handle the `.json` name hashing.

More info about that can be found [here](https://vitejs.dev/guide/assets).

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.