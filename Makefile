PORT := 3000
NODEDIR := node_modules

.PHONY: all
all: $(NODEDIR)

$(NODEDIR):
	npm install

.PHONY: run
run: $(ALL)
	PORT=$(PORT) node app.js

.PHONY: clean
clean:
	rm -rf node_modules
