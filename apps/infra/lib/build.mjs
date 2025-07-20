import { build } from 'esbuild'
import { glob } from 'glob'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const resolversPath = join(__dirname, '../../../packages/appsync-resolvers')
const files = await glob('src/**/*.ts', { cwd: resolversPath })


await build({
    sourcemap: 'inline',
    sourcesContent: false,
    format: 'esm',
    target: 'esnext',
    platform: 'node',
    external: ['@aws-appsync/utils'],
    outdir: join(resolversPath, 'build'),
    entryPoints: files.map(file => join(resolversPath, file)),
    bundle: true
})

console.log('✅ AppSync resolvers built successfully')