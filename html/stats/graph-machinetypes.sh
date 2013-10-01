#!/bin/bash
grep machine-types /root/quattor/svncache/build/xml/*.dep | sort -r | cut -d ' ' -f 1 | uniq -w 60 | cut -d : -f 2 | cut -d / -f 2- | sort | uniq -c
