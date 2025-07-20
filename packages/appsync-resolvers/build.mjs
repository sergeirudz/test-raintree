import { build } from 'esbuild'
import { glob } from 'glob'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isWatch = process.argv.includes('--watch')

async function buildResolvers() {
    console.log('🔍 Finding TypeScript resolver files...')

    const files = await glob('src/**/*.ts', { cwd: __dirname })

    if (files.length === 0) {
        console.log('⚠️  No TypeScript files found in src/')
        return
    }

    console.log(`📦 Building ${files.length} resolver files:`)
    files.forEach(file => console.log(`   • ${file}`))

    const buildOptions = {
        entryPoints: files.map(file => join(__dirname, file)),
        outdir: join(__dirname, 'build'),
        bundle: true,
        platform: 'node',
        target: 'esnext',
        format: 'esm',
        sourcemap: 'inline',
        sourcesContent: false,
        external: ['@aws-appsync/utils'],
        logLevel: 'info',
        metafile: true,
    }

    if (isWatch) {
        console.log('👀 Starting watch mode...')
        const ctx = await build({
            ...buildOptions,
            plugins: [{
                name: 'rebuild-notify',
                setup(build) {
                    build.onEnd(result => {
                        if (result.errors.length > 0) {
                            console.log('❌ Build failed')
                        } else {
                            console.log('✅ Build completed successfully')
                        }
                    })
                }
            }]
        })

        await ctx.watch()
        console.log('Watching for changes...')
    } else {
        const result = await build(buildOptions)

        if (result.errors.length > 0) {
            console.log('❌ Build failed with errors')
            process.exit(1)
        }

        console.log('✅ Build completed successfully')
        console.log(`📁 Output directory: ${join(__dirname, 'build')}`)
    }
}

buildResolvers().catch(error => {
    console.error('💥 Build error:', error)
    process.exit(1)
})
