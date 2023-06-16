import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
	{
		input:'src/utils.js',
		output:{
			file: path.resolve(__dirname,'lib/utils.js'),
			format: 'esm',
			sourcemap: true,
		},
		plugins: [
			commonjs(),
			json(),
		]
	},
	{
		input:'src/index.ts',
		output:{
			file: path.resolve(__dirname,'lib/index.js'),
			format: 'esm',
			sourcemap: true,
		},
		plugins:[
			nodeResolve({
				extensions:['.js', '.ts']
			}),
			ts({
				tsconfig: path.resolve(__dirname, 'tsconfig.json')
			}),
			commonjs(),
			json(),
		]
	},
]
