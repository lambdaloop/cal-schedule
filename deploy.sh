#!/usr/bin/env bash

git checkout gh-pages
git merge master -m 'merge'
webpack --optimize-occurence-order --optimize-dedupe --optimize-minimize
git commit -am 'update build'
git push origin gh-pages
git checkout master
