# `@ekidpro/socola`

## Usage

```
import { Socola } from '@ekidpro/socola';

<Socola
  moduleId="your_module_id"
  secretKey="your_secret_key"
  socolaToken="your_token"
  // and another optional props
/>
```

## Usage with Webpack 5+

### Step 1: `npm i node-polyfill-webpack-plugin stream-browserify stream-http -D`
### Step 2: Edit webpack config


```
//webpack.config.js
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

{
  ...
  resolve: {
    ...
    fallback: {
      "http": require.resolve("stream-http"),
      "stream": require.resolve("stream-browserify")
    }
  },

  ...
  plugins: [
    ..., 
    new NodePolyfillPlugin()
  ]
}
```

We are still in the development

So, if you want to make the first try, check it on: https://ekidpro-vn.github.io/socola