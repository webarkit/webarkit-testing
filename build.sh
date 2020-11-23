#!/usr/bin/env bash

if [ ! -f "opencv/build_wasm/em-flags.txt" ] ; then
  curl --location "https://github.com/webarkit/opencv-em/releases/download/0.0.3/opencv-em-4.5.0-alpha-rc1.zip" -o opencv-em.zip
  unzip -o opencv-em.zip -d opencv
  cp -avr opencv/build_wasm/opencv ./
  rm opencv-em.zip
fi
