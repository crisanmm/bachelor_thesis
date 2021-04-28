#!/bin/bash
pid=`ps aux | grep "node out/index.js" | grep -v grep | tr -s " " " " | cut -d " " -f2`
# if string is not empty
if [ -n "${pid}" ]
then
    kill -9 $pid
fi