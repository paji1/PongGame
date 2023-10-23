#!/bin/bash

branches=("auth" "dev" "game" "homepage" "production" "profile")

git checkout main

for branch in "${branches[@]}"
do
  git checkout "$branch"
  git rebase main
  
done
git checkout main
