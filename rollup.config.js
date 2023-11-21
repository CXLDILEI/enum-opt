import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

const plugins = [
	nodeResolve({
		extensions:['.js', '.ts']
	}),
	ts({
		tsconfig: path.resolve(__dirname, 'tsconfig.json')
	}),
	commonjs(),
	json(),
]

export default [
	{
		input:'src/utils.ts',
		output:{
			file: path.resolve(__dirname,'lib/utils.js'),
			format: 'es',
			sourcemap: true,
		},
		plugins,
	},
	{
		input:'src/index.ts',
		output:{
			file: path.resolve(__dirname,'lib/index.js'),
			format: 'cjs',
			sourcemap: true,
		},
		plugins,
	},
	{
		input:'src/core.ts',
		output:{
			file: path.resolve(__dirname,'lib/core.js'),
			format: 'cjs',
			sourcemap: true,
		},
		plugins,
	},
]
