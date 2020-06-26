#!/bin/bash

if [ "$#" -ne 3 ]; then
  echo "Usage: process-audio.sh infile.wav outfile.wav noise.profile"
  echo "You can generate a noise profile by running: sox noise.wav -n noiseprof noise.profile"
  exit -1
fi

temp_file_1=$(mktemp)
temp_file_2=$(mktemp)
sox -v 0.90 \
    "$1" \
    -b 16 \
    "${temp_file_1}.wav" \
    remix 1 \
    highpass 100 \
    noisered "$3" 0.1
sox "${temp_file_1}.wav" "${temp_file_2}.wav" \
    rate 22050 \
    trim 0 -0.025 \
    compand 0.3,5 6:-70,-60,-20 -10 -6 0.2 \
    gain -n -0.1 \
    silence 1 0.1 1% reverse
sox "${temp_file_2}.wav" "$2" \
    silence 1 0.1 1% reverse
rm ${temp_file_1} ${temp_file_2}