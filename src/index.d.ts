import type { Plugin } from 'vite';

interface Options {
    atlasInclude: string | string[],
}

declare const _default: (options: Options) => Plugin;

export default _default;