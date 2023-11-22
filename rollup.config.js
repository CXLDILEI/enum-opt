import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import { terser } from 'rollup-plugin-terser';

const plugins = [
	nodeResolve({
		extensions:['.js', '.ts']
	}),
	ts({
		tsconfig: path.resolve(__dirname, 'tsconfig.json')
	}),
	commonjs(),
	json(),
	babel({
		babelHelpers: 'bundled',
		exclude: "node_modules/**",
	}),
	terser(),
	uglify(),
]

export default [
	{
		input:'src/utils.ts',
		output:{
			file: path.resolve(__dirname,'lib/utils.js'),
			format: 'es',
			sourcemap: false,
		},
		plugins,
	},
	{
		input:'src/index.ts',
		output:{
			file: path.resolve(__dirname,'lib/index.js'),
			format: 'cjs',
			sourcemap: false,
		},
		plugins,
	},
	{
		input:'src/core.ts',
		output:{
			file: path.resolve(__dirname,'lib/core.js'),
			format: 'cjs',
			sourcemap: false,
		},
		plugins,
	},
]
