#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)


if [ $current_branch == "main" ]; then
  echo "ERROR: you trying to merge the main" >&2
  exit 1
fi

git checkout dev
git merge $current_branch

