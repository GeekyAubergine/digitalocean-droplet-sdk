test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test

lint:
	./node_modules/.bin/eslint ./*.js ./**/*.js

coverage:
	./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha

.PHONY: coverage

showcoverage:
	./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha && open coverage/lcov-report/index.html

.PHONY: showcoverage

qa: lint test