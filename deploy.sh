#!/usr/bin/env bash

git checkout gh-pages
git merge master --no-commit
webpack --optimize-occurence-order --optimize-dedupe --optimize-minimize
git commit -am 'merge and update build'
git push origin gh-pages
git checkout master
