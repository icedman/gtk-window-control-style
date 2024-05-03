all: install

.PHONY: install

install:
	echo "installing..."
	./generate.js

uninstall:
	echo "removing..."
	rm -rf ~/.config/gtk-*