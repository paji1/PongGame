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
    exit 3
  fi
  if git commit -m "Staging changes on branch $branch (with the script)"; then
    echo "Commit successful"
  else
    exit_status=$?
    if [ $exit_status -eq 1 ]; then
      echo "Nothing to commit, working tree is clean."
    else
      echo "An error occurred during the commit."
      exit 3
    fi
  fi
done

# Finally, switch back to the main branch
git checkout main