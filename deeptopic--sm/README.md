# README.md

I'm not really sure what to call this. It's like an accordion but not in a self-contained box: it's for the entire page or a huge chunk of content on a page. So you've got the "top level" of your sections immediately visible, with sub-content a click away.

Uses requestAnimationFrame to draw the expansion and collapsing animations. Subtle timing changes based on in/out, whether the content is all visible on the page or scrolls off, etc...

Also uses a "zebra" class to handle "striping" the sections.

## Notes

There's an issue with grunt-contrib-concat not picking up sourcemaps. Change line 149 of ```./node_modules/grunt-contrib-concat/tasks/lib/sourcemap.js``` like so to fix it:

```
      if (/data:application\/json;(charset[:=]utf-8;)?base64,([^\s]+)/.test(sourceMapFile)) {
```
