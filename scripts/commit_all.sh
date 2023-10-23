#!/bin/bash

branches=("auth" "dev" "game" "homepage" "production" "profile")

git checkout main

for branch in "${branches[@]}"
do
  git checkout "$branch"
  if [ $? -ne 0 ]; then
    echo "Conflicts occurred on branch $branch. Please resolve them and continue the rebase."
    exit 3
  fi
  git add --all  # Stage all changes
  if [ $? -ne 0 ]; then
    echo "Conflicts occurred on branch $branch. Please resolve them and continue the rebase."
    exit 1
  fi
  git commit -m "Staging changes on branch $branch"
  if [ $? -ne 0 ]; then
    echo "Conflicts occurred on branch $branch. Please resolve them and continue the rebase."
    exit 2
  fi
done

# Finally, switch back to the main branch
git checkout main