#!/bin/bash

# Check 'rec' exists
sox_installed=`which rec | wc -l`
if [ "$sox_installed" -ne 1 ]; then
  echo "Could not find 'rec' binary. This program requires Sox to be installed."
  exit -1
fi

# Check arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: ./record-lines.sh corpus.txt output_folder"
  exit 64
fi

mkdir -p "$2/wavs"

count=1
lines=`wc -l < "$1"`

# Read corpus.txt line by line
while IFS="" read -u 3 -r p || [ -n "$p" ]
do

  # If line is in recorded_lines.txt, skip to the next line
  if [ "`grep "$p" "$2/metadata.csv" | wc -l`" -eq 1 ]; then
    count=$((count + 1))
    continue
  fi

  while true
  do
    # Print line number and text with soft word wrapping and left margin
    clear
    printf '\n[%d/%d]\n\n%s\n\n\n\n\n\n\n\n' "$count" "$lines" "$p" | fold -s | sed 's/^/  /'

    # Print input options and wait
    read -s -p "  Enter = (REC)"
    tput cuu 7

    # Record to output_folder/count.wav with return as the interrupt key
    stty intr ^M
    rec "$2/wavs/`printf "%09d" $count`.wav"
    stty intr ^C

    # Erase the last 8 lines
    tput cuu 8
    for x in $(seq 8); do
      tput el; echo
    done
    tput cuu 2

    # Print input options and wait
    read -s -n1 -p "  Enter = (SAVE)   Backspace = (REPEAT)" key
    printf '\n'

    # If return key pressed, move onto the next line
    if [[ $key = "" ]]; then
      echo "`printf "%09d" $count`|$p|$p" >> "$2/metadata.csv"
      break
    fi
  done
  count=$((count + 1))
done 3< "$1"
