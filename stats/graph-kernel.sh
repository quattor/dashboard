#!/bin/bash
grep -h '<nlist name="kernel">' /www/html/profiles/*.xml -A 1 | grep version | cut -d \> -f 2 | cut -d \< -f 1 | sort | uniq -c
