#!/bin/sh

nohup http-server . -p 8086 >> ../logs/front.log &
