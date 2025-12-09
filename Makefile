deb-x64:
	npm run make:deb:x64

deb-arm64:
	npm run make:deb:arm64

deb: deb-x64 deb-arm64


zip-x64:
	npm run make:zip:x64

zip-arm64:
	npm run make:zip:arm64

zip: zip-x64 zip-arm64


squirrel-x64: 
	npm run make:squirrel:x64

squirrel-arm64: 
	npm run make:squirrel:arm64

squirrel: squirrel-x64 squirrel-arm64

msix-x64: 
	npm run make:msix:x64

msix-arm64: 
	npm run make:msix:arm64

msix: msix-x64 msix-arm64

dmg-x64: 
	npm run make:dmg:x64
	mkdir -p out/make/mac/amd64
	mv out/make/*x64.dmg out/make/mac/amd64/

dmg-arm64: 
	npm run make:dmg:arm64
	mkdir -p out/make/mac/arm64
	mv out/make/*arm64.dmg out/make/mac/arm64/

dmg: dmg-x64 dmg-arm64