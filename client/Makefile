all:
	node build.js prod
	cp production/nudgepad.min.js production/nudgepad.temp.js
	java -jar ~/compiler.jar --js=production/nudgepad.temp.js --js_output_file=production/nudgepad.min.js --language_in=ECMASCRIPT5
	rm production/nudgepad.temp.js

# Before you start developing, untrack generated files
untrack:
	git update-index --assume-unchanged production/nudgepad.dev.html
	git update-index --assume-unchanged production/nudgepad.min.html
	git update-index --assume-unchanged production/nudgepad.min.css
	git update-index --assume-unchanged production/nudgepad.min.js

# Retrack generated files to deploy
track:
	git update-index --no-assume-unchanged production/nudgepad.dev.html
	git update-index --no-assume-unchanged production/nudgepad.min.html
	git update-index --no-assume-unchanged production/nudgepad.min.css
	git update-index --no-assume-unchanged production/nudgepad.min.js

space:
	cp ~/space/space.js public/js/space.js
	cp ~/space/space.min.js public/js/space.min.js

scraps:
	cp ~/scraps/scraps.js public/js/scraps.js
	cp ~/scraps/scraps.min.js public/js/scraps.min.js

htmltoscraps:
	cp ~/htmltoscraps/jquery.htmltoscraps.js public/js/jquery.htmltoscraps.js

csstospace:
	cp ~/csstospace/csstospace.js public/js/csstospace.js

mate:
	mate build.js core Makefile tools