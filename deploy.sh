#!/usr/bin/env bash

git branch -D gh-pages 
git checkout -b gh-pages
webpack --optimize-occurence-order --optimize-dedupe --optimize-minimize
git add -f build
git commit -am 'update build'
git push origin -f gh-pages
git checkout master
