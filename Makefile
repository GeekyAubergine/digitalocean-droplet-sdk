test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test

lint:
	./node_modules/.bin/eslint ./**/*.js

qa: lint test