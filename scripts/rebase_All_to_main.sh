#!/bin/bash

branches=("auth" "dev" "game" "homepage" "production" "profile")

for branch in "${branches[@]}"
do
  git checkout "$branch"
  git rebase main
  
done
git checkout main
