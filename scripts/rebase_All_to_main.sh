#!/bin/bash

branches=("auth" "dev" "game" "homepage" "production" "profile")

git checkout main

for branch in "${branches[@]}"
do
  git checkout "$branch"
  git rebase main
  if [ $? -ne 0 ]; then
    echo "Conflicts occurred on branch $branch. Please resolve them and continue the rebase."
    exit 3
  fi
done
git checkout main
