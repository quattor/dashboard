#!/bin/bash
grep -ho 'Errata.*' /www/html/profiles/*.xml | awk '{print $nf}' | sort | uniq -c
