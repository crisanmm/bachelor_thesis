#!/bin/bash
pid=`ps aux | grep "node out/index.js" | grep -v grep | tr -s " " " " | cut -d " " -f2`
kill -9 $pid