FILES= \
	node_modules

build: $(FILES)

clean:
	rm -rf $(FILES)

check: node_modules
	find . \( -name '*.js' -or -name '*.json' \) \
	-and -not -path './node_modules/*' \
	-exec node_modules/.bin/jslint -indent 2 {} \;

node_modules: package.json
	npm install

.PHONY: install clean
