# README.md

Junk code quick start folder. Lite version. Copy this, ```npm install```, go to town.

## Notes

There's an issue with grunt-contrib-concat not picking up sourcemaps. Change line 149 of ```./node_modules/grunt-contrib-concat/tasks/lib/sourcemap.js``` like so to fix it:

```
      if (/data:application\/json;(charset[:=]utf-8;)?base64,([^\s]+)/.test(sourceMapFile)) {
```

Here's a one-liner for that:

```
sed -i .bak '149s/charset:/charset\[:=\]/' ./node_modules/grunt-contrib-concat/tasks/lib/sourcemap.js
```
