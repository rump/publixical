FILES= \
	node_modules

build: $(FILES)
	chmod +x index.js

clean:
	rm -fr $(FILES)

check:
	find . \( -name '*.js' -or -name '*.json' \) \
	-and -not -path './node_modules/*' \
	-exec jshint {} \;

node_modules: package.json
	npm install

.PHONY: build clean check
