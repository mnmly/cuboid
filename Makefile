
build: components index.js cuboid.css template.js
	@component build --dev

template.js: template.html
	@component convert $<

%.js: %.coffee
	@coffee -cb $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
