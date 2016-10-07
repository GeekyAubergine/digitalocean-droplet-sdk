test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test

lint:
	./node_modules/.bin/eslint ./**/*.js

coverage:
	./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha

.PHONY: coverage

qa: lint test