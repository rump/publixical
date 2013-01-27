FILES= \
	node_modules

install: $(FILES)

clean:
	rm -r $(FILES)

node_modules: package.json
	npm install

.PHONY: install clean
