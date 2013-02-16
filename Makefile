pwd=$(shell pwd)
build= \
	node_modules
install= \
	/etc/init/publixical.conf \
	/etc/nginx/sites-enabled/publixical

build: $(build)
	chmod +x index.js

clean:
	rm -fr $(build) &
	rm -f log

install: uninstall $(install)

uninstall:
	rm -f $(install)

check:
	find . \( -name '*.js' -or -name '*.json' \) \
	-and -not -path './node_modules/*' \
	-exec jshint {} \;


node_modules: package.json
	npm install

/etc/init/publixical.conf: etc/init
	sed -E 's#%PWD%$$#$(pwd)#g' < $< > $@

/etc/nginx/sites-enabled/publixical: etc/nginx
	cp $(pwd)/$< $@


.PHONY: build clean install uninstall check
