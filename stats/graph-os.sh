#!/bin/bash
grep '<nlist name="nbp">' /www/html/profiles/*.xml -A 10 | grep '<string name="label' | cut -d '>' -f 2 | cut -d '<' -f 1 | sort | uniq -c
