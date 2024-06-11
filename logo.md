# regenerate logo

Refer to the following steps to regenerate the logo.

## install Boxy Svg

[Boxy Svg](https://apps.apple.com/cn/app/boxy-svg/id611658502?mt=12)

## edit logo

- open logo.svg with Boxy Svg.
- do some edit.
- export logo.png

## prepare scripts

```shell
# install icotool
brew install icotool
```

```shell
# create script png2icns
cat <<EOF > ~/.local/bin/png2icns
#!/bin/bash

if [ \$# -eq 0 ]; then
    echo "please input image path"
    exit
fi

input=\$1

if [ -f \$input ]; then
    echo "image path: \"\$input\""
else
    echo "image not exists: \"\$input\""
    exit
fi

temp_dir=\${input%.*}.iconset
mkdir \$temp_dir
sizes=(16 32 64 128 256 512 1024)
for size in \${sizes[@]};
do
    echo "generating icon: \${size}x\${size}"
    sips -z \$size \$size \$input --out \$temp_dir/icon_\${size}x\${size}.png
done
echo "generate finish!"
echo "merge icns..."
output=\${input%.*}.icns
iconutil -c icns \$temp_dir -o \$output
rm -fr \$temp_dir
echo "merge finish: \"\$output\""

EOF

chmod +x ~/.local/bin/png2icns
```

```shell
# create script pngsips
cat <<EOF > ~/.local/bin/pngsips
#!/bin/bash

if [ \$# -eq 0 ];
then
    echo "please input image path and zoom size"
    exit
fi

if [ \$# -eq 1 ];
then
    echo "please input zoom size"
    exit
fi

input=\$1
size=\$2

if [ -f \$input ];then
    echo "image path: \"\$input\""
else
    echo "image not exists: \"\$input\""
    exit
fi

case \$size in
    [1-9][0-9]*)
        echo "zoom size: \"\$size\""
        ;;
    *)
    echo "invalid zoom size: \"\$size\""
    exit
    ;;
esac

output=\${input%.*}\${size}.png

sips -z \$size \$size \$input --out \$output
echo "zoom finish: \"\$output\""

EOF

chmod +x ~/.local/bin/pngsips
```

## export logo

### macos

```shell
png2icns logo.png
mv logo.icns packages/main/logo/mac/logo.icns
```

### linux

```shell
pngsips logo.png 1024
mv logo1024.png packages/main/logo/linux/1024x1024.png
pngsips logo.png 512
mv logo512.png packages/main/logo/linux/512x512.png
pngsips logo.png 256
mv logo256.png packages/main/logo/linux/256x256.png
pngsips logo.png 128
mv logo128.png packages/main/logo/linux/128x128.png
pngsips logo.png 64
mv logo64.png packages/main/logo/linux/64x64.png
pngsips logo.png 32
mv logo32.png packages/main/logo/linux/32x32.png
```

### windows

```shell
pngsips logo.png 256
icotool -c logo256.png -o logo.ico
rm -f logo256.png
mv logo.ico packages/main/logo/windows/logo.ico
```

### renderer

```shell
pngsips logo.png 512
pngsips logo.png 192
pngsips logo.png 64
icotool -c logo64.png -o favicon.ico
rm -f logo64.png
mv logo512.png packages/renderer/public/logo512.png
mv logo192.png packages/renderer/public/logo192.png
mv favicon.ico packages/renderer/public/favicon.ico
```

### clean

```shell
rm -f logo.png
```
