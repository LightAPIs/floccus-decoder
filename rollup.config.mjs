import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import versionInjector from 'rollup-plugin-version-injector';
import copyPack from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: {
    name: 'index.js',
    dir: 'dist',
    format: 'iife',
  },
  plugins: [
    typescript(),
    versionInjector(),
    resolve(),
    copyPack({
      targets: [
        {
          src: 'src/assets/*',
          dest: 'dist',
        },
      ],
      hook: 'writeBundle',
    }),
  ],
};
