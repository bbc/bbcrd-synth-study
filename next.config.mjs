const isGithubActions = process.env.GITHUB_ACTIONS || false

let pageConfig = {}

if (isGithubActions) {
	pageConfig = {
		basePath: '/bbcrd-synth-study',
		images: {
			unoptimized: true
		},
		output: 'export'
	}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	...pageConfig,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true
	}
}

export default nextConfig
