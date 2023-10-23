#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)


if [ $current_branch == "main" ]; then
  echo "ERROR: you trying to merge the main" >&2
  exit 1
fi

if [ $current_branch == "dev" ]; then
  echo "ERROR: you trying to merge the dev" >&2
  exit 1
fi


read -p "can make a conflict . Do you want to continue? (Type 'yes' or 'y' to continue, 'no' to exit):" user_input

case "$user_input" in
  [Yy]*)
    echo " accepted."
    ;;
  ""*)
    echo " accepted"
    ;;
  [Nn]*)
    echo " declined"
    ;;
  *)
    echo " Invalid input."
    ;;
esac


# git rebase dev
