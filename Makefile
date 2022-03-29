install:
	npm ci
lint:
	npx eslint .
serve:
	npx webpack serve
dev:
	npx webpack
build:
	rm -rf dist
	NODE_ENV=production npx webpack
